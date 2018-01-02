import * as path from 'path';

import chalk from 'chalk';
import * as _ from 'lodash';

import { Command, CommandLineInputs, CommandLineOptions } from '@ionic/cli-framework';
import { copyDirectory, fsWriteFile, removeDirectory } from '@ionic/cli-framework/utils/fs';

import { StarterList } from '../definitions';
import { getDirectories, log, readStarterManifest, runcmd } from '../utils';

import {
  BUILD_DIRECTORY,
  INTEGRATIONS_DIRECTORY,
  IONIC_TYPE_DIRECTORIES,
  REPO_DIRECTORY,
  STARTERS_LIST_PATH,
  STARTER_TYPE_COMMUNITY,
  STARTER_TYPE_OFFICIAL,
  buildStarter,
  getStarterInfoFromPath,
} from '../lib/build';

export class BuildCommand extends Command {
  async getMetadata() {
    return {
      name: 'build',
      description: 'Builds all the starters',
      inputs: [
        {
          name: 'starter',
          description: 'Path to single starter to build',
        },
      ],
    };
  }

  async run(inputs: CommandLineInputs, options: CommandLineOptions) {
    const [ starter ] = inputs;

    console.log('-----');
    console.log(chalk.cyan.bold('BUILD'));
    console.log('-----');
    console.log(`Wiping ${chalk.bold(`${BUILD_DIRECTORY}/*`)}`);

    await removeDirectory(`${BUILD_DIRECTORY}/*`);

    await Promise.all(IONIC_TYPE_DIRECTORIES.map(async (ionicType) => {
      const baseDir = path.resolve(REPO_DIRECTORY, ionicType, 'base');
      const baseChanges = (await runcmd('git', ['status', '--porcelain', '--', baseDir])).trim();

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
        await copyDirectory(integrationDir, path.resolve(BUILD_DIRECTORY, integration));
        starterList.integrations.push({ name, id: integration });
        log(integration, chalk.green('Copied!'));
      }));

      console.log(`Writing ${chalk.cyan('starters.json')}`);
      await fsWriteFile(STARTERS_LIST_PATH, JSON.stringify(starterList, undefined, 2), { encoding: 'utf8' });
    }
  }
}
