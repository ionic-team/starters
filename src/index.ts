import { CommandMap, Namespace, execute } from '@ionic/cli-framework';

import { BuildCommand } from './commands/build';
import { DeployCommand } from './commands/deploy';
import { FindRedundantCommand } from './commands/find-redundant';
import { GenerateChecksumCommand } from './commands/generate-checksum';
import { TestCommand } from './commands/test';

class StartersNamespace extends Namespace {
  async getMetadata() {
    return {
      name: 'ionic-starters',
      summary: '',
    };
  }

  async getCommands(): Promise<CommandMap> {
    return new CommandMap([
      ['build', async () => new BuildCommand(this)],
      ['deploy', async () => new DeployCommand(this)],
      ['find-redundant', async () => new FindRedundantCommand(this)],
      ['generate-checksum', async () => new GenerateChecksumCommand(this)],
      ['test', async () => new TestCommand(this)],
    ]);
  }
}

const namespace = new StartersNamespace();

export async function run(argv: string[], env: { [k: string]: string; }) {
  await execute({ namespace, argv, env });
}
