import * as path from 'path';

import chalk from 'chalk';

import { Command, CommandLineInputs, CommandLineOptions } from '@ionic/cli-framework';

import { getDirectories, log, readStarterManifest, runcmd } from '../utils';
import { BUILD_DIRECTORY } from '../lib/build';

export class TestCommand extends Command {
  async getMetadata() {
    return {
      name: 'test',
      summary: 'Test the built starters',
      inputs: [
        {
          name: 'starter',
          summary: 'Path to single starter to test',
        },
      ],
    };
  }

  async run(inputs: CommandLineInputs, options: CommandLineOptions) {
    // const [ starter ] = inputs;

    console.log('----');
    console.log(chalk.cyan.bold('TEST'));
    console.log('----');

    const contents = await getDirectories(BUILD_DIRECTORY);
    const failedTests: string[] = [];

    for (const dir of contents) {
      const id = path.basename(dir);

      try {
        const manifest = await readStarterManifest(dir);

        if (manifest && manifest.scripts && manifest.scripts.test) {
          log(id, 'Installing dependencies...');
          await runcmd('npm', ['install'], { cwd: dir, stdio: 'inherit' });
          log(id, `> ${chalk.green(manifest.scripts.test)}`);
          await runcmd(manifest.scripts.test, [], { cwd: dir, stdio: 'inherit', shell: true });
        }
      } catch (e) {
        log(id, chalk.red('Test script failed!'));
        failedTests.push(id);
      }
    }

    if (failedTests.length > 0) {
      console.error('\n' + chalk.red('Starter tests failed: ') + failedTests.map(s => chalk.cyan(s)).join(', '));
      process.exitCode = 1;
    }
  }
}
