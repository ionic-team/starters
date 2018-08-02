import * as path from 'path';

import chalk from 'chalk';

import { Command, CommandLineInputs, CommandLineOptions, CommandMetadata } from '@ionic/cli-framework';

import { getCommandHeader, getDirectories, log, readStarterManifest, runcmd } from '../utils';
import { BUILD_DIRECTORY } from '../lib/build';

export class TestCommand extends Command {
  async getMetadata(): Promise<CommandMetadata> {
    return {
      name: 'test',
      summary: 'Test the built starters',
      inputs: [
        {
          name: 'starter',
          summary: 'ID of built starter to test',
        },
      ],
      options: [
        {
          name: 'type',
          summary: 'Only test starters of this type',
        },
      ]
    };
  }

  async run(inputs: CommandLineInputs, options: CommandLineOptions) {
    const [ starter ] = inputs;
    const type = options['type'] ? String(options['type']) : undefined;

    console.log(getCommandHeader('TEST'));

    const contents = starter ? [path.resolve(BUILD_DIRECTORY, starter)] : await getDirectories(BUILD_DIRECTORY);
    const failedTests: string[] = [];
    const builtStarters = type ? contents.filter(d => path.basename(d).startsWith(type)) : contents;

    if (builtStarters.length === 0) {
      console.error('No starters found.');
      process.exitCode = 1;
      return;
    }

    for (const dir of builtStarters) {
      const id = path.basename(dir);

      try {
        const manifest = await readStarterManifest(dir);

        if (manifest && manifest.scripts && manifest.scripts.test) {
          log(id, 'Installing dependencies...');
          await runcmd('npm', ['install'], { cwd: dir, stdio: 'inherit' });
          log(id, `> ${chalk.green(manifest.scripts.test)}`);
          await runcmd(manifest.scripts.test, [], { cwd: dir, stdio: 'inherit', shell: true });
        } else {
          log(id, 'No tests defined in manifest!');
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
