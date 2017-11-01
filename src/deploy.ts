import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util'

import chalk from 'chalk';
import * as archiver from 'archiver';
import * as S3 from 'aws-sdk/clients/s3';
import * as CloudFront from 'aws-sdk/clients/cloudfront';
import * as ncp from 'ncp';
import * as rimraf from 'rimraf';

const statp = util.promisify(fs.stat);
const readFilep = util.promisify(fs.readFile);
const readdirp = util.promisify(fs.readdir);
const writeFilep = util.promisify(fs.writeFile);
const ncpp: (s: string, d: string, o?: ncp.Options) => void = <any>util.promisify(ncp.ncp);
const rimrafp: (p: string) => void = <any>util.promisify(rimraf);

const TYPE_DIRECTORIES = ['ionic1', 'ionic-angular'];

const s3 = new S3({ apiVersion: '2006-03-01' });
const cloudfront = new CloudFront({ apiVersion: '2017-03-25' });
const templateKeys: string[] = [];

interface StarterManifest {
  dependencies?: { [key: string]: string; };
}

interface PackageJson {
  dependencies: { [key: string]: string; };
}

async function run() {
  await Promise.all(TYPE_DIRECTORIES.map(async (starterType) => {
    const starterDirs = await getDirectories(path.resolve(starterType, 'starters'));
    await Promise.all(starterDirs.map(starterDir => buildStarterArchive(starterType, starterDir)));
  }));

  console.log('=>', `Invalidating cache for keys:\n${templateKeys.map(k => `    - ${chalk.bold(k)}`).join('\n')}`);

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

async function buildStarterArchive(starterType: string, starterDir: string): Promise<void> {
  const baseDir = path.resolve(starterType, 'base');
  const starter = path.basename(starterDir);
  const id = `${starterType}-starter-${starter}`;
  const tmpdest = path.resolve(os.tmpdir(), id);
  const templateKey = `${id}.tar.gz`;

  console.log('=>', chalk.cyan(starterType), chalk.cyan(starter), 'Building and uploading archive...');

  templateKeys.push(templateKey);

  const starterManifestPath = path.resolve(path.dirname(starterDir), `${starter}.json`);
  const manifest = await readStarterManifest(starterManifestPath);

  await ncpp(baseDir, tmpdest, {});
  await ncpp(starterDir, tmpdest, {});

  const packageJsonPath = path.resolve(tmpdest, 'package.json');
  const packageJson = await readPackageJson(packageJsonPath);

  if (manifest && manifest.dependencies) {
    Object.assign(packageJson.dependencies, manifest.dependencies);
    await writeFilep(packageJsonPath, JSON.stringify(packageJson, undefined, 2), { encoding: 'utf8' });
  }

  const archive = archiver('tar');
  archive.directory(tmpdest, false);

  await uploadArchive(archive, templateKey);

  await rimrafp(tmpdest);

  console.log('=>', chalk.cyan(starterType), chalk.cyan(starter), `Uploaded!`);
}

async function readPackageJson(p: string): Promise<PackageJson> {
  const contents = await readFile(p);

  if (!contents) {
    throw new Error(`Error with file: ${p}`);
  }

  return JSON.parse(contents);
}

async function readStarterManifest(p: string): Promise<StarterManifest | undefined> {
  const contents = await readFile(p);

  if (!contents) {
    return;
  }

  return JSON.parse(contents);
}

async function readFile(p: string): Promise<string | undefined> {
  try {
    const stats = await statp(p);

    if (!stats.isFile()) {
      return;
    }
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }

    return;
  }

  return readFilep(p, { encoding: 'utf8' });
}

async function uploadArchive(archive: archiver.Archiver, key: string) {
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
  return stats.filter(([f, stats]) => stats.isDirectory()).map(([f,]) => path.resolve(p, f));
}

run().catch(e => console.error(e));
