import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util'

import * as archiver from 'archiver';
import * as S3 from 'aws-sdk/clients/s3';

const statp = util.promisify(fs.stat);
const readdirp = util.promisify(fs.readdir);

const TYPE_DIRECTORIES = ['ionic-angular'];

const s3 = new S3({ apiVersion: '2006-03-01' });

async function run() {
  await Promise.all(TYPE_DIRECTORIES.map(async (starterType) => {
    const baseDir = path.resolve(starterType, 'base');
    const startersDir = path.resolve(starterType, 'starters');
    const starters = await getDirectories(startersDir);

    await Promise.all(starters.map(async (starter) => {
      const archive = archiver('tar');
      archive.directory(baseDir, false);

      return uploadTemplate(archive, `${starterType}-starter-${starter}`, path.resolve(startersDir, starter));
    }));
  }));
}

async function getDirectories(p: string): Promise<string[]> {
  const contents = await readdirp(p);
  const stats = await Promise.all(contents.map(async (f): Promise<[string, fs.Stats]> => [f, await statp(path.resolve(p, f))]));
  return stats.filter(([f, stats]) => stats.isDirectory()).map(([f,]) => f);
}

async function uploadTemplate(archive: archiver.Archiver, id: string, dir: string) {
  archive.directory(dir, false);
  archive.finalize();

  await s3.upload({
    Bucket: 'ionic-starters',
    Key: `${id}.tar.gz`,
    Body: archive,
  }).promise();
}

run().catch(e => console.error(e));
