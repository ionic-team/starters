import * as path from 'path';

import chalk from 'chalk';
import * as _ from 'lodash';

import { copyDirectory, fsUnlink, fsWriteFile } from '@ionic/cli-framework/utils/fs';
import { readPackageJsonFile } from '@ionic/cli-framework/utils/npm';

import { log, readGitignore, readStarterManifest, readTsconfigJson } from '../utils';

export const STARTER_TYPE_OFFICIAL = 'official';
export const STARTER_TYPE_COMMUNITY = 'community';
export const REPO_DIRECTORY = path.resolve(path.dirname(path.dirname(__dirname)));
export const INTEGRATIONS_DIRECTORY = path.resolve(REPO_DIRECTORY, 'integrations');
export const IONIC_TYPE_DIRECTORIES = ['ionic1', 'ionic-angular', 'ionic-core-angular'];

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

export async function buildStarter(ionicType: string, starterType: string, starterDir: string): Promise<string> {
  const baseDir = path.resolve(REPO_DIRECTORY, ionicType, 'base');
  const starter = generateStarterName(starterType, starterDir);
  const id = `${ionicType}-${starterType}-${starter}`;
  const tmpdest = path.resolve(BUILD_DIRECTORY, id);

  log(id, 'Building...');

  const manifest = await readStarterManifest(starterDir);

  await copyDirectory(baseDir, tmpdest, {});
  await copyDirectory(starterDir, tmpdest, {});

  try {
    await fsUnlink(path.resolve(tmpdest, '.git'));
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }

  const pkgPath = path.resolve(tmpdest, 'package.json')
  const pkg = await readPackageJsonFile(pkgPath);

  log(id, `Performing manifest operations for ${chalk.bold(manifest.name)}`);

  if (manifest.packageJson) {
    _.mergeWith(pkg, manifest.packageJson, (objv, v) => _.isArray(v) ? v : undefined);
    await fsWriteFile(pkgPath, JSON.stringify(pkg, undefined, 2) + '\n', { encoding: 'utf8' });
  }

  const tsconfigJson = await readTsconfigJson(tmpdest);

  if (Object.keys(tsconfigJson).length > 0 && manifest.tsconfigJson) {
    _.mergeWith(tsconfigJson, manifest.tsconfigJson, (objv, v) => _.isArray(v) ? v: undefined);
    await fsWriteFile(path.resolve(tmpdest, 'tsconfig.json'), JSON.stringify(tsconfigJson, undefined, 2) + '\n', { encoding: 'utf8' });
  }

  const gitignore = await readGitignore(tmpdest);

  if (manifest.gitignore) {
    let united = _.union(gitignore.map(x => x.trim()), manifest.gitignore.map(x => x.trim()));
    await fsWriteFile(path.resolve(tmpdest, '.gitignore'), united.join("\n") + '\n', { encoding: 'utf8' });
  }

  return id;
}
