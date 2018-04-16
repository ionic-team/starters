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
      summary: 'Builds all the starters',
      inputs: [
        {
          name: 'starter',
          summary: 'Path to single starter to build',
        },
      ],
      options: [
        {
          name: 'current',
          summary: 'Use base files as-is, do not checkout base files using baseref',
          type: Boolean,
        },
      ],
    };
  }

  async run(inputs: CommandLineInputs, options: CommandLineOptions) {
    const [ starter ] = inputs;
    const current = options['current'] ? true : false;

    const gitVersion = (await runcmd('git', ['--version'])).trim();

    console.log('-----');
    console.log(chalk.cyan.bold('BUILD'));
    console.log('-----');

    console.log(`\n${gitVersion}\n`);

    console.log(`Wiping ${chalk.bold(`${BUILD_DIRECTORY}/*`)}`);

    await removeDirectory(`${BUILD_DIRECTORY}/*`);

    for (const ionicType of IONIC_TYPE_DIRECTORIES) {
      const baseDir = path.resolve(REPO_DIRECTORY, ionicType, 'base');
      const baseChanges = (await runcmd('git', ['status', '--porcelain', '--', baseDir])).trim();

      if (baseChanges && !current) {
        console.error(chalk.red(
          `Changes detected in ${chalk.bold(baseDir)}.\n` +
          `You must either commit/reset these changes OR explicitly use the ${chalk.green('--current')} flag, which ignores starter baserefs.`
        ));

        process.exit(1);
      }
    }

    if (starter) {
      const starterDir = path.resolve(starter);

      if (!starterDir.startsWith(REPO_DIRECTORY)) {
        throw new Error(chalk.red('Starter not in this repo.'));
      }

      const [ ionicType, starterType ] = getStarterInfoFromPath(starterDir);
      await buildStarter(ionicType, starterType, starterDir);
    } else {
      const starterList: StarterList = { starters: [], integrations: [] };
      const currentSha1 = (await runcmd('git', ['rev-parse', 'HEAD'])).trim();

      for (const ionicType of IONIC_TYPE_DIRECTORIES) {
        const baseDir = path.resolve(REPO_DIRECTORY, ionicType, 'base');
        const officialStarterDirs = await getDirectories(path.resolve(ionicType, STARTER_TYPE_OFFICIAL));
        const communityScopes = await getDirectories(path.resolve(ionicType, STARTER_TYPE_COMMUNITY));
        const communityStarterDirs = _.flatten(await Promise.all(communityScopes.map(async (scopeDir) => getDirectories(scopeDir))));
        const starterDirs = officialStarterDirs.concat(communityStarterDirs);

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
            const name = rest.join('/');
            const id = await buildStarter(ionicType, starterType, starterDir);
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
        await copyDirectory(integrationDir, path.resolve(BUILD_DIRECTORY, integration));
        starterList.integrations.push({ name, id: integration });
        log(integration, chalk.green('Copied!'));
      }));

      console.log(`Writing ${chalk.cyan('starters.json')}\n`);
      await fsWriteFile(STARTERS_LIST_PATH, JSON.stringify(starterList, undefined, 2), { encoding: 'utf8' });

      const mismatchedStarters = starterList.starters.filter(s => s.sha1 !== currentSha1);

      if (mismatchedStarters.length > 0) {
        const currentRef = (await runcmd('git', ['log', '-1', '--format="%D"', currentSha1])).trim();

        console.log(
          `The following starters were built from a ref other than ${chalk.bold(currentRef ? currentRef : currentSha1)}:\n` +
          ` - ${mismatchedStarters.map(s => `${chalk.cyan(s.id)} ${chalk.dim(`(${s.ref})`)}`).join('\n - ')}\n` +
          `If this isn't what you want, consider running with the ${chalk.green('--current')} flag, which ignores starter baserefs.`
        );
      }
    }
  }
}
