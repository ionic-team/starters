import * as path from 'path';

import chalk from 'chalk';
import * as _ from 'lodash';
// import { spawn } from 'cross-spawn';

import { StarterList } from './definitions';

import {
  getDirectories,
  log,
  ncpp,
  readPackageJson,
  readTsconfigJson,
  readGitignore,
  readStarterManifest,
  rimrafp,
  runcmd,
  unlink,
  writeFilep,
} from './utils';

const STARTER_TYPE_OFFICIAL = 'official';
const STARTER_TYPE_COMMUNITY = 'community';
const REPO_DIRECTORY = path.resolve(path.dirname(__dirname));
const INTEGRATIONS_DIRECTORY = path.resolve(REPO_DIRECTORY, 'integrations');
const IONIC_TYPE_DIRECTORIES = ['ionic1', 'ionic-angular'];

export const BUILD_DIRECTORY = path.resolve(REPO_DIRECTORY, 'build');
export const STARTERS_LIST_PATH = path.resolve(BUILD_DIRECTORY, 'starters.json');

export async function run() {
  const starter = process.argv[2];

  console.log('-----');
  console.log(chalk.cyan.bold('BUILD'));
  console.log('-----');
  console.log(`Wiping ${chalk.bold(`${BUILD_DIRECTORY}/*`)}`);

  await rimrafp(`${BUILD_DIRECTORY}/*`);

  await Promise.all(IONIC_TYPE_DIRECTORIES.map(async (ionicType) => {
    const baseDir = path.resolve(REPO_DIRECTORY, ionicType, 'base');
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

    if (!starterDir.startsWith(REPO_DIRECTORY)) {
      throw new Error(chalk.red('Starter not in this repo.'));
    }

    const [ ionicType, starterType ] = getStarterInfoFromPath(starterDir);
    await buildStarter(ionicType, starterType, starterDir);
  } else {
    const starterList: StarterList = { starters: [], integrations: [] };

    for (let ionicType of IONIC_TYPE_DIRECTORIES) {
      const baseDir = path.resolve(REPO_DIRECTORY, ionicType, 'base');
      const officialStarterDirs = await getDirectories(path.resolve(ionicType, STARTER_TYPE_OFFICIAL));
      const communityScopes = await getDirectories(path.resolve(ionicType, STARTER_TYPE_COMMUNITY));
      const communityStarterDirs = _.flatten(await Promise.all(communityScopes.map(async (scopeDir) => getDirectories(scopeDir))));
      const starterDirs = officialStarterDirs.concat(communityStarterDirs);

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
        console.log(`Checking out ${chalk.cyan.bold(ionicType)} base files at ${chalk.bold(ref)}`);

        await runcmd('git', ['checkout', ref, '--', baseDir]);

        await Promise.all(starterDirsAtRef.map(async (starterDir) => {
          const [ , starterType, ...rest ] = getStarterInfoFromPath(starterDir);
          const name = rest.join('/');
          const id = await buildStarter(ionicType, starterType, starterDir);
          starterList.starters.push({ name, id, type: ionicType });
        }));

        await runcmd('git', ['checkout', currentBranch, '--', baseDir]);
      }
    }

    const integrationDirs = await getDirectories(INTEGRATIONS_DIRECTORY);

    await Promise.all(integrationDirs.map(async (integrationDir) => {
      const name = path.basename(integrationDir);
      const integration = `integration-${name}`;
      await ncpp(integrationDir, path.resolve(BUILD_DIRECTORY, integration));
      starterList.integrations.push({ name, id: integration });
      log(integration, chalk.green('Copied!'));
    }));

    console.log(`Writing ${chalk.cyan('starters.json')}`);
    await writeFilep(STARTERS_LIST_PATH, JSON.stringify(starterList, undefined, 2));
  }
}

function getStarterInfoFromPath(starterDir: string): string[] {
  return starterDir.substring(REPO_DIRECTORY.length + 1).split(path.sep);
}

function generateStarterName(starterType: string, starterDir: string) {
  if (starterType === STARTER_TYPE_OFFICIAL) {
    return path.basename(starterDir).toLowerCase();
  } else if (starterType === STARTER_TYPE_COMMUNITY) {
    const scope = path.dirname(starterDir);
    return `${path.basename(scope)}-${path.basename(starterDir)}`.toLowerCase();
  }

  throw new Error(chalk.red(`Unknown starter type: ${starterType}`));
}

async function buildStarter(ionicType: string, starterType: string, starterDir: string): Promise<string> {
  const baseDir = path.resolve(REPO_DIRECTORY, ionicType, 'base');
  const starter = generateStarterName(starterType, starterDir);
  const id = `${ionicType}-${starterType}-${starter}`;
  const tmpdest = path.resolve(BUILD_DIRECTORY, id);

  log(id, 'Building...');

  const manifest = await readStarterManifest(starterDir);

  await ncpp(baseDir, tmpdest, {});
  await ncpp(starterDir, tmpdest, {});

  try {
    await unlink(path.resolve(tmpdest, '.git'));
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }

  const packageJson = await readPackageJson(tmpdest);

  log(id, `Performing manifest operations for ${chalk.bold(manifest.name)}`);

  if (manifest.packageJson) {
    _.mergeWith(packageJson, manifest.packageJson, (objv, v) => _.isArray(v) ? v : undefined);
    await writeFilep(path.resolve(tmpdest, 'package.json'), JSON.stringify(packageJson, undefined, 2) + '\n', { encoding: 'utf8' });
  }

  const tsconfigJson = await readTsconfigJson(tmpdest);

  if (Object.keys(tsconfigJson).length > 0 && manifest.tsconfigJson) {
    _.mergeWith(tsconfigJson, manifest.tsconfigJson, (objv, v) => _.isArray(v) ? v: undefined);
    await writeFilep(path.resolve(tmpdest, 'tsconfig.json'), JSON.stringify(tsconfigJson, undefined, 2) + '\n', { encoding: 'utf8' });
  }

  const gitignore = await readGitignore(tmpdest);

  if (manifest.gitignore) {
    let united = _.union(gitignore.map(x => x.trim()), manifest.gitignore.map(x => x.trim()));
    await writeFilep(path.resolve(tmpdest, '.gitignore'), united.join("\n") + '\n', { encoding: 'utf8' });
  }

  // const depstmpdest = `${tmpdest}-dependencies`;
  // await mkdirp(depstmpdest);

  // log(id, `Installing ${chalk.bold('node_modules')} dependencies`);
  // await npmInstall(tmpdest);

  // await renamep(path.resolve(tmpdest, 'node_modules'), path.resolve(depstmpdest, 'node_modules'));

  return id;
}

// async function npmInstall(dir: string) {
//   const p = spawn('npm', ['install', '--no-shrinkwrap', '--no-package-lock', '--ignore-scripts'], { cwd: dir, stdio: 'inherit', env: { PATH: process.env.PATH, NODE_ENV: 'development' } });

//   return new Promise((resolve, reject) => {
//     p.on('err', err => {
//       reject(err);
//     });

//     p.on('close', code => {
//       if (code === 0) {
//         resolve();
//       } else {
//         reject(new Error(`bad status code: ${code}`));
//       }
//     });
//   });
// }
