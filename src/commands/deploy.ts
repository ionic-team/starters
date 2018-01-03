import * as fs from 'fs';
import * as path from 'path';

import chalk from 'chalk';
import * as archiver from 'archiver';
import * as S3 from 'aws-sdk/clients/s3';
import * as CloudFront from 'aws-sdk/clients/cloudfront';

import { Command, CommandLineInputs, CommandLineOptions } from '@ionic/cli-framework';

import { getDirectories, log } from '../utils';
import { BUILD_DIRECTORY, STARTERS_LIST_PATH } from '../lib/build';

const s3 = new S3({ apiVersion: '2006-03-01' });
const cloudfront = new CloudFront({ apiVersion: '2017-03-25' });

const keys: string[] = [];

export class DeployCommand extends Command {
  async getMetadata() {
    return {
      name: 'deploy',
      description: 'Deploys the built starter templates to the CDN',
      options: [
        {
          name: 'tag',
          description: `Deploy to a tag, such as 'next' ('latest' is production)`,
          default: 'testing',
        },
        {
          name: 'dry',
          description: 'Perform a dry run and do not upload anything',
          type: Boolean,
        },
      ],
    };
  }

  async run(inputs: CommandLineInputs, options: CommandLineOptions) {
    const tag = options['tag'] ? String(options['tag']) : 'testing';
    const dry = options['dry'] ? true : false;

    console.log('------');
    console.log(chalk.cyan.bold('DEPLOY'));
    console.log('------');

    console.log(`tag: ${chalk.bold(tag)}`);

    const contents = await getDirectories(BUILD_DIRECTORY);

    await Promise.all(contents.map(async (dir) => {
      const id = path.basename(dir);
      const templateKey = `${tag === 'latest' ? '' : `${tag}/`}${id}.tar.gz`;

      if (dry) {
        log(id, chalk.green(`${chalk.bold('--dry')}: upload to ${chalk.bold(templateKey)}`));
      } else {
        const archive = archiver('tar');

        // archive.on('entry', (entry) => {
        //   console.log('add', entry.name);
        // });

        archive.directory(dir, false);
        archive.finalize();

        log(id, `Archiving and uploading`);

        await upload(archive, templateKey);
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

async function upload(rs: NodeJS.ReadableStream, key: string, params?: Partial<S3.PutObjectRequest>) {
  await s3.upload({
    Bucket: 'ionic-starters',
    Key: key,
    Body: rs,
    ...params,
  }).promise();
}
