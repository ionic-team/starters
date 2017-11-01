import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util'

import chalk from 'chalk';
import * as archiver from 'archiver';
import * as S3 from 'aws-sdk/clients/s3';
import * as CloudFront from 'aws-sdk/clients/cloudfront';

const statp = util.promisify(fs.stat);
const readdirp = util.promisify(fs.readdir);

const TYPE_DIRECTORIES = ['ionic-angular'];

const s3 = new S3({ apiVersion: '2006-03-01' });
const cloudfront = new CloudFront({ apiVersion: '2017-03-25' });

async function run() {
  const templateKeys: string[] = [];

  await Promise.all(TYPE_DIRECTORIES.map(async (starterType) => {
    const baseDir = path.resolve(starterType, 'base');
    const startersDir = path.resolve(starterType, 'starters');
    const starters = await getDirectories(startersDir);

    await Promise.all(starters.map(async (starter) => {
      console.log('=>', chalk.cyan(starterType), chalk.cyan(starter), 'Building and uploading archive...');
      const archive = archiver('tar');
      archive.directory(baseDir, false);

      const templateKey = `${starterType}-starter-${starter}.tar.gz`;
      templateKeys.push(templateKey);
      await uploadTemplate(archive, templateKey, path.resolve(startersDir, starter));

      console.log('=>', chalk.cyan(starterType), chalk.cyan(starter), `Uploaded!`);
    }));
  }));

  console.log('=>', `Invalidating cache for keys: ${templateKeys.map(k => chalk.bold(k)).join(', ')}`);

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

  console.log('=>', `Invalidation ID: ${chalk.bold(result.Invalidation.Id)}`);
}

async function uploadTemplate(archive: archiver.Archiver, key: string, dir: string) {
  archive.directory(dir, false);
  archive.finalize();

  await s3.upload({
    Bucket: 'ionic-starters',
    Key: key,
    Body: archive,
  }).promise();
}

async function getDirectories(p: string): Promise<string[]> {
  const contents = await readdirp(p);
  const stats = await Promise.all(contents.map(async (f): Promise<[string, fs.Stats]> => [f, await statp(path.resolve(p, f))]));
  return stats.filter(([f, stats]) => stats.isDirectory()).map(([f,]) => f);
}

run().catch(e => console.error(e));
