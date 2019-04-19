import * as path from 'path';

import chalk from 'chalk';

import { Command, CommandLineInputs, CommandLineOptions, CommandMetadata } from '@ionic/cli-framework';
import { remove } from '@ionic/utils-fs';

import { getCommandHeader, runcmd } from '../utils';
import { BUILD_DIRECTORY, REPO_DIRECTORY, buildStarter, buildStarters, gatherChangedBaseFiles, getStarterInfoFromPath } from '../lib/build';

export class BuildCommand extends Command {
  async getMetadata(): Promise<CommandMetadata> {
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
        {
          name: 'wipe',
          summary: 'Do not wipe build directory',
          type: Boolean,
          default: true,
        },
      ],
    };
  }

  async run(inputs: CommandLineInputs, options: CommandLineOptions) {
    const [ starter ] = inputs;
    const current = options['current'] ? true : false;
    const wipe = options['wipe'] ? true : false;

    const gitVersion = (await runcmd('git', ['--version'])).trim();

    console.log(getCommandHeader('BUILD'));
    console.log(`\n${gitVersion}\n`);

    if (wipe) {
      console.log(`Wiping ${chalk.bold(`${BUILD_DIRECTORY}/*`)}`);
      await remove(`${BUILD_DIRECTORY}/*`);
    }

    const changedBaseFiles = await gatherChangedBaseFiles();

    if (!current && changedBaseFiles.length > 0) {
      console.error(chalk.red(
        `Changes detected in ${changedBaseFiles.map(p => chalk.bold(p)).join(', ')}.\n` +
        `You must either commit/reset these changes OR explicitly use the ${chalk.green('--current')} flag, which ignores starter baserefs.`
      ));

      process.exit(1);
    }

    if (starter) {
      const starterDir = path.resolve(starter);

      if (!starterDir.startsWith(REPO_DIRECTORY)) {
        throw new Error(chalk.red('Starter not in this repo.'));
      }

      const [ ionicType, starterType ] = getStarterInfoFromPath(starterDir);
      await buildStarter(ionicType, starterType, starterDir);
    } else {
      const currentSha1 = (await runcmd('git', ['rev-parse', 'HEAD'])).trim();
      const starterList = await buildStarters({ current, sha1: currentSha1 });
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
