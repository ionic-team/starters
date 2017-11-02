import * as path from 'path';

import chalk from 'chalk';
import * as archiver from 'archiver';
import * as S3 from 'aws-sdk/clients/s3';
import * as CloudFront from 'aws-sdk/clients/cloudfront';

import { getDirectories, log } from './utils';

const s3 = new S3({ apiVersion: '2006-03-01' });
const cloudfront = new CloudFront({ apiVersion: '2017-03-25' });

const templateKeys: string[] = [];

async function run() {
  const contents = await getDirectories('build');

  await Promise.all(contents.map(async (dir) => {
    const id = path.basename(dir);
    const archive = archiver('tar');
    const templateKey = `${id}.tar.gz`;

    archive.directory(dir, false);

    await uploadArchive(archive, templateKey);
    log(id, chalk.green(`Uploaded!`));

    templateKeys.push(templateKey);
  }));

  console.log(`Invalidating cache for keys:\n${templateKeys.map(k => `    - ${chalk.bold(k)}`).join('\n')}`);

  const result = await cloudfront.createInvalidation({
    DistributionId: 'E1XZ2T0DZXJ521',
    InvalidationBatch: {
      CallerReference: String(new Date().getTime()),
      Paths: {
        Quantity: templateKeys.length,
        Items: templateKeys.map(k => `/${k}`),
      },
    },
  }).promise();

  if (!result.Invalidation) {
    throw new Error('No result from invalidation batch.');
  }

  console.log(`Invalidation ID: ${chalk.bold(result.Invalidation.Id)}`);
}

async function uploadArchive(archive: archiver.Archiver, key: string) {
  archive.finalize();

  await s3.upload({
    Bucket: 'ionic-starters',
    Key: key,
    Body: archive,
  }).promise();
}

run().catch(e => console.error(e));
