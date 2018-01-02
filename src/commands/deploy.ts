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
      name: 'build',
      description: 'Builds all the starters',
      inputs: [
        {
          name: 'starter',
          description: 'Path to single starter to build',
        },
      ],
    };
  }

  async run(inputs: CommandLineInputs, options: CommandLineOptions) {
    console.log('------');
    console.log(chalk.cyan.bold('DEPLOY'));
    console.log('------');

    const contents = await getDirectories(BUILD_DIRECTORY);

    await Promise.all(contents.map(async (dir) => {
      const id = path.basename(dir);
      const archive = archiver('tar');
      const templateKey = `${id}.tar.gz`;

      // archive.on('entry', (entry) => {
      //   console.log('add', entry.name);
      // });

      archive.directory(dir, false);
      archive.finalize();

      log(id, `Archiving and uploading`);

      await upload(archive, templateKey);
      keys.push(templateKey);

      log(id, chalk.green(`Uploaded!`));
    }));

    await upload(fs.createReadStream(STARTERS_LIST_PATH), 'starters.json', { ContentType: 'application/json' });
    keys.push('starters.json');

    log('starters.json', chalk.green('Uploaded!'));

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

async function upload(rs: NodeJS.ReadableStream, key: string, params?: Partial<S3.PutObjectRequest>) {
  await s3.upload({
    Bucket: 'ionic-starters',
    Key: key,
    Body: rs,
    ...params,
  }).promise();
}
