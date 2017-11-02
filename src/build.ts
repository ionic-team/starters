import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util'

import chalk from 'chalk';
import * as ncp from 'ncp';
import * as rimraf from 'rimraf';

import { readPackageJson, readStarterManifest, getDirectories, log, runcmd } from './utils';

const writeFilep = util.promisify(fs.writeFile);
const ncpp: (s: string, d: string, o?: ncp.Options) => void = <any>util.promisify(ncp.ncp);
const rimrafp: (p: string) => void = <any>util.promisify(rimraf);

const BUILD_DIRECTORY = 'build';
const TYPE_DIRECTORIES = ['ionic1', 'ionic-angular'];

async function run() {
  const starter = process.argv[2];

  await rimrafp(`${BUILD_DIRECTORY}/*`);

  await Promise.all(TYPE_DIRECTORIES.map(async (starterType) => {
    const baseDir = path.resolve(starterType, 'base');
    const baseChanges = Boolean((await runcmd('git', ['status', '--porcelain', '--', baseDir])).trim());

    if (baseChanges) {
      if (starter) {
        console.warn(chalk.yellow(
          `${chalk.bold('WARNING')}: Changes detected in ${chalk.bold(baseDir)}. ` +
          `Building ${chalk.bold(starter)} with LATEST (not base files from ${chalk.bold('baseref')})`
        ));
      } else {
        throw new Error(chalk.red(
          `Changes detected in ${chalk.bold(baseDir)}. ` +
          `With changes in the base files, you can only build one starter at a time. (try ${chalk.green('npm run build -- path/to/starter')})`
        ));
      }
    }
  }));

  if (starter) {
    const starterDir = path.resolve(starter);
    const starterType = path.basename(path.dirname(path.dirname(starterDir)));
    await buildStarterArchive(starterType, starterDir);
  } else  {
    await Promise.all(TYPE_DIRECTORIES.map(async (starterType) => {
      const baseDir = path.resolve(starterType, 'base');
      const starterDirs = await getDirectories(path.resolve(starterType, 'official'));
      const refmap = new Map<string, string[]>();

      await Promise.all(starterDirs.map(async (starterDir) => {
        const manifest = await readStarterManifest(starterDir);
        let starterDirsAtRef = refmap.get(manifest.baseref);

        if (!starterDirsAtRef) {
          starterDirsAtRef = [];
        }

        starterDirsAtRef.push(starterDir);
        refmap.set(manifest.baseref, starterDirsAtRef);
      }));

      const currentBranch = (await runcmd('git', ['rev-parse', '--abbrev-ref', 'HEAD'])).trim();

      for (let [ref, starterDirsAtRef] of refmap.entries()) {
        console.log(`Checking out ${chalk.cyan.bold(starterType)} base files at ${chalk.bold(ref)}`);

        await runcmd('git', ['checkout', ref, '--', baseDir]);
        await Promise.all(starterDirsAtRef.map(starterDir => buildStarterArchive(starterType, starterDir)));
        await runcmd('git', ['checkout', currentBranch, '--', baseDir]);
      }
    }));
  }
}

async function buildStarterArchive(starterType: string, starterDir: string): Promise<void> {
  const baseDir = path.resolve(starterType, 'base');
  const starter = path.basename(starterDir);
  const id = `${starterType}-starter-${starter}`;
  const tmpdest = path.resolve(BUILD_DIRECTORY, id);

  log(id, 'Building...');

  const manifest = await readStarterManifest(starterDir);

  await ncpp(baseDir, tmpdest, {});
  await ncpp(starterDir, tmpdest, {});

  const packageJson = await readPackageJson(tmpdest);

  log(id, `Performing manifest operations for ${chalk.bold(manifest.name)}`);

  if (manifest.dependencies) {
    Object.assign(packageJson.dependencies, manifest.dependencies);
    await writeFilep(path.resolve(tmpdest, 'package.json'), JSON.stringify(packageJson, undefined, 2) + '\n', { encoding: 'utf8' });
  }

  log(id, chalk.green('Built!'));
}

run().catch(e => console.error(e));
