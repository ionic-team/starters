import * as path from 'path';

import chalk from 'chalk';

import { Command, CommandLineInputs, CommandLineOptions } from '@ionic/cli-framework';
import { fsReadFile, fsWriteFile } from '@ionic/cli-framework/utils/fs';

import { IONIC_MANIFEST_FILE, getCommandHeader, getDirectories, log } from '../utils';
import { BUILD_DIRECTORY, REPO_DIRECTORY } from '../lib/build';

export class GenerateChecksumCommand extends Command {
  async getMetadata() {
    return {
      name: 'generate-checksum',
      summary: 'Generate a checksum file of starter package.json and manifest files',
    };
  }

  async run(inputs: CommandLineInputs, options: CommandLineOptions) {
    console.log(getCommandHeader('GENERATE CHECKSUM'));
    const contents = await getDirectories(BUILD_DIRECTORY);

    const checksumFiles: string[] = [];

    for (const dir of contents) {
      const id = path.basename(dir);

      try {
        const pkg = await fsReadFile(path.resolve(dir, 'package.json'), { encoding: 'utf8' });
        const manifest = await fsReadFile(path.resolve(dir, IONIC_MANIFEST_FILE), { encoding: 'utf8' });

        log(id, 'Appending package.json and manifest file to checksum file');

        checksumFiles.push(id, pkg.trim(), manifest.trim(), '\n');
      } catch (e) {
        log(id, chalk.red(`Error during checksum collection: ${e.stack ? e.stack : e}`));
      }
    }

    await fsWriteFile(path.resolve(REPO_DIRECTORY, 'starter-checksum'), checksumFiles.join('\n'), { encoding: 'utf8' });
  }
}
