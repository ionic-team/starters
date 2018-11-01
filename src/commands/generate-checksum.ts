import * as path from 'path';
import { createHash } from 'crypto';

import chalk from 'chalk';

import { Command, CommandLineInputs, CommandLineOptions, CommandMetadata } from '@ionic/cli-framework';
import { readFile, writeFile } from '@ionic/utils-fs';

import { IONIC_MANIFEST_FILE, getCommandHeader, getDirectories, log } from '../utils';
import { BUILD_DIRECTORY, IONIC_TYPE_DIRECTORIES, REPO_DIRECTORY } from '../lib/build';

export class GenerateChecksumCommand extends Command {
  async getMetadata(): Promise<CommandMetadata> {
    return {
      name: 'generate-checksum',
      summary: 'Generate checksum files for each starter type using package.json and manifest files',
    };
  }

  async run(inputs: CommandLineInputs, options: CommandLineOptions) {
    console.log(getCommandHeader('GENERATE CHECKSUM'));

    const contents = await getDirectories(BUILD_DIRECTORY);

    for (const type of IONIC_TYPE_DIRECTORIES) {
      const hash = createHash('sha256');
      const builtStarters = contents.filter(d => path.basename(d).startsWith(type));
      const checksumFile = `starter-checksum-${type}.sha256`;

      for (const dir of builtStarters) {
        const id = path.basename(dir);

        try {
          const pkg = await readFile(path.resolve(dir, 'package.json'), { encoding: 'utf8' });
          const manifest = await readFile(path.resolve(dir, IONIC_MANIFEST_FILE), { encoding: 'utf8' });

          log(id, `Appending to checksum file: ${chalk.bold(checksumFile)}`);

          hash.update(id);
          hash.update(pkg.trim());
          hash.update(manifest.trim());
        } catch (e) {
          log(id, chalk.red(`Error during checksum collection: ${e.stack ? e.stack : e}`));
        }
      }

      await writeFile(path.resolve(REPO_DIRECTORY, checksumFile), hash.digest('hex'), { encoding: 'utf8' });
    }
  }
}
