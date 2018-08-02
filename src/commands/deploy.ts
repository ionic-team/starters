import * as fs from 'fs';
import * as path from 'path';

import chalk from 'chalk';
import * as lodash from 'lodash';
import * as tar from 'tar';
import * as minimatch from 'minimatch';
import * as S3 from 'aws-sdk/clients/s3';
import * as CloudFront from 'aws-sdk/clients/cloudfront';

import { Command, CommandLineInputs, CommandLineOptions, CommandMetadata } from '@ionic/cli-framework';

import { getCommandHeader, getDirectories, log, readStarterManifest } from '../utils';
import { BUILD_DIRECTORY, STARTERS_LIST_PATH } from '../lib/build';

const s3 = new S3({ apiVersion: '2006-03-01' });
const cloudfront = new CloudFront({ apiVersion: '2017-03-25' });

const keys: string[] = [];

export class DeployCommand extends Command {
  async getMetadata(): Promise<CommandMetadata> {
    return {
      name: 'deploy',
      summary: 'Deploys the built starter templates to the CDN',
      options: [
        {
          name: 'tag',
          summary: `Deploy to a tag, such as 'next' ('latest' is production)`,
          default: 'testing',
        },
        {
          name: 'dry',
          summary: 'Perform a dry run and do not upload anything',
          type: Boolean,
        },
      ],
    };
  }

  async run(inputs: CommandLineInputs, options: CommandLineOptions) {
    const tag = options['tag'] ? String(options['tag']) : 'testing';
    const dry = options['dry'] ? true : false;

    console.log(getCommandHeader('DEPLOY'));

    console.log(`tag: ${chalk.bold(tag)}`);

    const contents = await getDirectories(BUILD_DIRECTORY);

    await Promise.all(contents.map(async (dir) => {
      const id = path.basename(dir);
      const templateFileName = `${id}.tar.gz`;
      const templateKey = `${tag === 'latest' ? '' : `${tag}/`}${templateFileName}`;
      const manifest = await readStarterManifest(dir);
      const tarignore = manifest && manifest.tarignore ? manifest.tarignore : undefined;

      const archive = tar.create({
        gzip: true,
        cwd: dir,
        filter: (p, stat) => {
          const filePath = path.relative(dir, path.resolve(dir, p));

          if (!tarignore) {
            return true;
          }

          return !lodash.some(tarignore.map(rule => minimatch(filePath, rule)));
        },
      }, ['.']);

      const archivePath = path.resolve(BUILD_DIRECTORY, templateFileName);
      await writeStarter(archive, archivePath);

      if (dry) {
        log(id, chalk.green(`${chalk.bold('--dry')}: upload to ${chalk.bold(templateKey)}`));
      } else {
        log(id, `Archiving and uploading`);

        // s3 needs a content length, and it's safe to know content length from a file
        await upload(fs.createReadStream(archivePath), templateKey);
        keys.push(templateKey);

        log(id, chalk.green(`Uploaded to ${chalk.bold(templateKey)}`));
      }
    }));

    const startersJsonKey = `${tag === 'latest' ? '' : `${tag}/`}starters.json`;

    if (dry) {
      console.log(chalk.bold('starters.json'), chalk.green(`${chalk.bold('--dry')}: upload to ${chalk.bold(startersJsonKey)}`));
    } else {
      await upload(fs.createReadStream(STARTERS_LIST_PATH), startersJsonKey, { ContentType: 'application/json' });
      keys.push(startersJsonKey);

      console.log(chalk.bold('starters.json'), chalk.green(`Uploaded to ${chalk.bold(startersJsonKey)}`));

      console.log(`Invalidating cache for keys:\n${keys.map(k => `    - ${chalk.bold(k)}`).join('\n')}`);

      const result = await cloudfront.createInvalidation({
        DistributionId: 'E1XZ2T0DZXJ521',
        InvalidationBatch: {
          CallerReference: String(new Date().getTime()),
          Paths: {
            Quantity: keys.length,
            Items: keys.map(k => `/${k}`),
          },
        },
      }).promise();

      if (!result.Invalidation) {
        throw new Error('No result from invalidation batch.');
      }

      console.log(`Invalidation ID: ${chalk.bold(result.Invalidation.Id)}`);
    }
  }
}

async function writeStarter(rs: NodeJS.ReadableStream, dest: string) {
  return new Promise<void>((resolve, reject) => {
    const ws = fs.createWriteStream(dest)
      .on('finish', () => resolve())
      .on('error', err => reject(err));

    rs.pipe(ws);
  });
}

async function upload(rs: NodeJS.ReadableStream, key: string, params?: Partial<S3.PutObjectRequest>) {
  await s3.upload({
    Bucket: 'ionic-starters',
    Key: key,
    Body: rs,
    ...params,
  }).promise();
}
