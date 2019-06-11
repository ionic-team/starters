import * as path from 'path';

import chalk from 'chalk';
import { Command, CommandLineInputs, CommandLineOptions, CommandMetadata } from '@ionic/cli-framework';
import { getFileChecksum, readdirp, stat } from '@ionic/utils-fs';

import { IONIC_TYPE_DIRECTORIES, REPO_DIRECTORY, buildStarterId, getStarterDirectories, getStarterInfoFromPath } from '../lib/build';
import { log } from '../utils';

export class FindRedundantCommand extends Command {
  async getMetadata(): Promise<CommandMetadata> {
    return {
      name: 'find-redundant',
      summary: 'Find redundant files in starters that exist as base files',
      options: [
        {
          name: 'community',
          summary: 'Include community starters',
          type: Boolean,
        },
      ],
    };
  }

  async run(inputs: CommandLineInputs, options: CommandLineOptions) {
    const community = options['community'] ? true : false;

    const redundantFiles: string[] = [];

    for (const ionicType of IONIC_TYPE_DIRECTORIES) {
      const baseDir = path.resolve(REPO_DIRECTORY, ionicType, 'base');
      const starterDirs = await getStarterDirectories(ionicType, { community });

      for (const starterDir of starterDirs) {
        const [ , starterType ] = getStarterInfoFromPath(starterDir);
        const id = buildStarterId(ionicType, starterType, starterDir);

        const contents = (await readdirp(starterDir)).map(p => p.substring(starterDir.length + 1));

        for (const file of contents) {
          const filePath = path.resolve(starterDir, file);
          const baseFilePath = path.resolve(baseDir, file);

          try {
            const [ fileStat, baseFileStat ] = await Promise.all([stat(filePath), stat(baseFilePath)]);

            if (!fileStat.isDirectory() && !baseFileStat.isDirectory()) {
              const [ fileChecksum, baseFileChecksum ] = await Promise.all([getFileChecksum(filePath), getFileChecksum(baseFilePath)]);

              if (fileChecksum === baseFileChecksum) {
                log(id, chalk.red(`${chalk.bold(file)}: same file in base files`));
                redundantFiles.push(filePath);
              } else {
                log(id, chalk.gray(`${chalk.bold(file)}: found in base files, but checksum differs`));
              }
            }
          } catch (e) {
            // ignore
          }
        }
      }
    }

    if (redundantFiles.length > 0) {
      console.log(
        `The following files were identified as redundant and should be deleted:\n` +
        ` - ${redundantFiles.map(f => chalk.bold(f.substring(REPO_DIRECTORY.length + 1))).join('\n - ')}\n`
      );
      process.exit(1);
    } else {
      console.log('No redundant files found!');
    }
  }
}
