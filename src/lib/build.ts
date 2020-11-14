import * as path from 'path';

import chalk from 'chalk';
import * as _ from 'lodash';

import { copy, remove, writeFile } from '@ionic/utils-fs';
import { readPackageJsonFile } from '@ionic/cli-framework/utils/node';

import { StarterList } from '../definitions';
import { getDirectories, log, readGitignore, readStarterManifest, readTsconfigJson, runcmd } from '../utils';

export const STARTER_TYPE_OFFICIAL = 'official';
export const STARTER_TYPE_COMMUNITY = 'community';
export const REPO_DIRECTORY = path.resolve(path.dirname(path.dirname(__dirname)));
export const INTEGRATIONS_DIRECTORY = path.resolve(REPO_DIRECTORY, 'integrations');
export const IONIC_TYPE_DIRECTORIES = ['ionic1', 'ionic-angular', 'angular', 'react', 'vue'];

export const BUILD_DIRECTORY = path.resolve(REPO_DIRECTORY, 'build');
export const STARTERS_LIST_PATH = path.resolve(BUILD_DIRECTORY, 'starters.json');

export function getStarterInfoFromPath(starterDir: string): string[] {
  return starterDir.substring(REPO_DIRECTORY.length + 1).split(path.sep);
}

export function generateStarterName(starterType: string, starterDir: string) {
  if (starterType === STARTER_TYPE_OFFICIAL) {
    return path.basename(starterDir).toLowerCase();
  } else if (starterType === STARTER_TYPE_COMMUNITY) {
    const scope = path.dirname(starterDir);
    return `${path.basename(scope)}-${path.basename(starterDir)}`.toLowerCase();
  }

  throw new Error(chalk.red(`Unknown starter type: ${starterType}`));
}

export async function gatherChangedBaseFiles(): Promise<string[]> {
  const changedBaseFiles: string[] = [];

  for (const ionicType of IONIC_TYPE_DIRECTORIES) {
    const baseDir = path.resolve(REPO_DIRECTORY, ionicType, 'base');
    const baseChanges = (await runcmd('git', ['status', '--porcelain', '--', baseDir])).trim();

    if (baseChanges) {
      changedBaseFiles.push(baseDir);
    }
  }

  return changedBaseFiles;
}

export async function getStarterDirectories(ionicType: string, { community = true }: { community?: boolean; } = {}): Promise<string[]> {
  const officialStarterDirs = await getDirectories(path.resolve(REPO_DIRECTORY, ionicType, STARTER_TYPE_OFFICIAL));

  if (community) {
    const communityScopes = await getDirectories(path.resolve(REPO_DIRECTORY, ionicType, STARTER_TYPE_COMMUNITY));
    const communityStarterDirs = _.flatten(await Promise.all(communityScopes.map(async (scopeDir) => getDirectories(scopeDir))));
    return [...officialStarterDirs, ...communityStarterDirs];
  }

  return officialStarterDirs;
}

export async function buildStarters({ current = false, sha1 }: { current?: boolean; sha1?: string; }): Promise<StarterList> {
  const starterList: StarterList = { starters: [], integrations: [] };

  if (!sha1) {
    sha1 = (await runcmd('git', ['rev-parse', 'HEAD'])).trim();
  }

  const currentSha1 = sha1;

  for (const ionicType of IONIC_TYPE_DIRECTORIES) {
    const baseDir = path.resolve(REPO_DIRECTORY, ionicType, 'base');
    const starterDirs = await getStarterDirectories(ionicType);

    const refmap = new Map<string, string[]>();

    await Promise.all(starterDirs.map(async (starterDir) => {
      const manifest = await readStarterManifest(starterDir);

      if (manifest) {
        let starterDirsAtRef = refmap.get(manifest.baseref);

        if (!starterDirsAtRef) {
          starterDirsAtRef = [];
        }

        starterDirsAtRef.push(starterDir);
        refmap.set(manifest.baseref, starterDirsAtRef);
      }
    }));

    for (const [ ref, starterDirsAtRef ] of refmap.entries()) {
      if (!current) {
        console.log(`Checking out ${chalk.cyan.bold(ionicType)} base files at ${chalk.bold(ref)}`);
        await runcmd('git', ['checkout', ref, '--', baseDir]);
      }

      await Promise.all(starterDirsAtRef.map(async (starterDir) => {
        const [ , starterType, ...rest ] = getStarterInfoFromPath(starterDir);
        const id = buildStarterId(ionicType, starterType, starterDir);
        await buildStarter(ionicType, starterType, starterDir);

        const name = rest.join('/');
        const sha1 = current ? currentSha1 : (await runcmd('git', ['rev-parse', ref])).trim();
        starterList.starters.push({ name, id, type: ionicType, ref, sha1 });
      }));

      if (!current) {
        await runcmd('git', ['checkout', currentSha1, '--', baseDir]);
      }
    }
  }

  const integrationDirs = await getDirectories(INTEGRATIONS_DIRECTORY);

  await Promise.all(integrationDirs.map(async (integrationDir) => {
    const name = path.basename(integrationDir);
    const integration = `integration-${name}`;
    await copy(integrationDir, path.resolve(BUILD_DIRECTORY, integration));
    starterList.integrations.push({ name, id: integration });
    log(integration, chalk.green('Copied!'));
  }));

  console.log(`Writing ${chalk.cyan('starters.json')}\n`);
  await writeFile(STARTERS_LIST_PATH, JSON.stringify(starterList, undefined, 2), { encoding: 'utf8' });

  return starterList;
}

export function buildStarterId(ionicType: string, starterType: string, starterDir: string): string {
  const starter = generateStarterName(starterType, starterDir);
  const id = `${ionicType}-${starterType}-${starter}`;

  return id;
}

export async function buildStarter(ionicType: string, starterType: string, starterDir: string): Promise<void> {
  const id = buildStarterId(ionicType, starterType, starterDir);
  const baseDir = path.resolve(REPO_DIRECTORY, ionicType, 'base');
  const tmpdest = path.resolve(BUILD_DIRECTORY, id);

  log(id, 'Building...');

  const manifest = await readStarterManifest(starterDir);

  if (!manifest) {
    throw new Error(`No starter manifest found in ${starterDir}`);
  }

  await copy(baseDir, tmpdest, {});
  await copy(starterDir, tmpdest, {});

  try {
    await remove(path.resolve(tmpdest, '.git'));
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }

  const pkgPath = path.resolve(tmpdest, 'package.json');
  const pkg = await readPackageJsonFile(pkgPath);

  log(id, `Performing manifest operations for ${chalk.bold(manifest.name)}`);

  if (manifest.packageJson) {
    _.mergeWith(pkg, manifest.packageJson, (objv, v) => _.isArray(v) ? v : undefined);
    await writeFile(pkgPath, JSON.stringify(pkg, undefined, 2) + '\n', { encoding: 'utf8' });
  }

  const tsconfigJson = await readTsconfigJson(tmpdest);

  if (Object.keys(tsconfigJson).length > 0 && manifest.tsconfigJson) {
    _.mergeWith(tsconfigJson, manifest.tsconfigJson, (objv, v) => _.isArray(v) ? v : undefined);
    await writeFile(path.resolve(tmpdest, 'tsconfig.json'), JSON.stringify(tsconfigJson, undefined, 2) + '\n', { encoding: 'utf8' });
  }

  const gitignore = await readGitignore(tmpdest);

  if (manifest.gitignore) {
    const united = _.union(gitignore.map(x => x.trim()), manifest.gitignore.map(x => x.trim()));
    await writeFile(path.resolve(tmpdest, '.gitignore'), united.join('\n') + '\n', { encoding: 'utf8' });
  }
}
