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

    await Promise.all(contents.map(async dir => {
      const id = path.basename(dir);
      const manifest = await readStarterManifest(dir);

      if (manifest && manifest.scripts && manifest.scripts.test) {
        log(id, 'Installing dependencies...');
        await runcmd('npm', ['install'], { cwd: dir, stdio: 'inherit' });
        log(id, `> ${chalk.green(manifest.scripts.test)}`);
        await runcmd(manifest.scripts.test, [], { cwd: dir, stdio: 'inherit', shell: true });
      }
    }));
  }
}
