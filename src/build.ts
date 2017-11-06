import * as path from 'path';

import chalk from 'chalk';
import * as _ from 'lodash';

import { StarterList } from './definitions';

import {
  getDirectories,
  log,
  ncpp,
  readPackageJson,
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
    await buildStarterArchive(ionicType, starterType, starterDir);
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
          const { id } = await buildStarterArchive(ionicType, starterType, starterDir);
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

async function buildStarterArchive(ionicType: string, starterType: string, starterDir: string): Promise<{ id: string; }> {
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

  log(id, chalk.green('Built!'));

  return { id };
}
