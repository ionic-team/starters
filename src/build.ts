import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util'

import chalk from 'chalk';
import * as ncp from 'ncp';
import * as rimraf from 'rimraf';

import { readPackageJson, readStarterManifest, getDirectories, log } from './utils';

const writeFilep = util.promisify(fs.writeFile);
const ncpp: (s: string, d: string, o?: ncp.Options) => void = <any>util.promisify(ncp.ncp);
const rimrafp: (p: string) => void = <any>util.promisify(rimraf);

const BUILD_DIRECTORY = 'build';
const TYPE_DIRECTORIES = ['ionic1', 'ionic-angular'];

async function run() {
  await rimrafp(`${BUILD_DIRECTORY}/*`);

  await Promise.all(TYPE_DIRECTORIES.map(async (starterType) => {
    const starterDirs = await getDirectories(path.resolve(starterType, 'starters'));
    await Promise.all(starterDirs.map(starterDir => buildStarterArchive(starterType, starterDir)));
  }));
}

async function buildStarterArchive(starterType: string, starterDir: string): Promise<void> {
  const baseDir = path.resolve(starterType, 'base');
  const starter = path.basename(starterDir);
  const id = `${starterType}-starter-${starter}`;
  const tmpdest = path.resolve(BUILD_DIRECTORY, id);

  log(id, 'Building...');

  const starterManifestPath = path.resolve(path.dirname(starterDir), starter, 'ionic.starter.json');
  const manifest = await readStarterManifest(starterManifestPath);

  await ncpp(baseDir, tmpdest, {});
  await ncpp(starterDir, tmpdest, {});

  const packageJsonPath = path.resolve(tmpdest, 'package.json');
  const packageJson = await readPackageJson(packageJsonPath);

  log(id, `Performing manifest operations for ${chalk.bold(manifest.name)}`);

  if (manifest.dependencies) {
    Object.assign(packageJson.dependencies, manifest.dependencies);
    await writeFilep(packageJsonPath, JSON.stringify(packageJson, undefined, 2) + '\n', { encoding: 'utf8' });
  }

  log(id, chalk.green('Built!'));
}

run().catch(e => console.error(e));
