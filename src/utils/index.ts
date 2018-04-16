import * as path from 'path';

import chalk from 'chalk';
import { spawn } from 'cross-spawn';

import { filter } from '@ionic/cli-framework/utils/array';
import { fsReadDir, fsReadFile, fsStat } from '@ionic/cli-framework/utils/fs';

import { StarterManifest, TsconfigJson } from '../definitions';

export async function getDirectories(p: string): Promise<string[]> {
  const contents = await fsReadDir(p);
  return filter(contents.map(f => path.resolve(p, f)), async f => (await fsStat(f)).isDirectory());
}

export async function readTsconfigJson(dir: string): Promise<TsconfigJson> {
  try {
    return JSON.parse(await fsReadFile(path.resolve(dir, 'tsconfig.json'), { encoding: 'utf8' }));
  } catch (e) {
    // ignore
  }

  return {};
}

export async function readGitignore(dir: string): Promise<string[]> {
  try {
    return (await fsReadFile(path.resolve(dir, '.gitignore'), { encoding: 'utf8' })).split(/\n/);
  } catch (e) {
    // ignore
  }

  return [];
}

export async function readStarterManifest(dir: string): Promise<StarterManifest> {
  const contents = await fsReadFile(path.resolve(dir, 'ionic.starter.json'), { encoding: 'utf8' });

  if (!contents) {
    throw new Error(`No starter manifest found in directory: ${dir}`);
  }

  return JSON.parse(contents);
}

export async function log(id: string, msg: string) {
  console.log(chalk.dim('=>'), chalk.cyan(id), msg);
}

export function runcmd(command: string, args?: string[]): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const p = spawn(command, args);

    const stdoutbufs: Buffer[] = [];
    const stderrbufs: Buffer[] = [];

    if (p.stdout) {
      p.stdout.on('data', chunk => {
        if (Buffer.isBuffer(chunk)) {
          stdoutbufs.push(chunk);
        } else {
          stdoutbufs.push(Buffer.from(chunk));
        }
      });
    }

    if (p.stderr) {
      p.stderr.on('data', chunk => {
        if (Buffer.isBuffer(chunk)) {
          stderrbufs.push(chunk);
        } else {
          stderrbufs.push(Buffer.from(chunk));
        }
      });
    }

    p.on('error', err => {
      reject(err);
    });

    p.on('close', code => {
      const stdout = Buffer.concat(stdoutbufs).toString();
      const stderr = Buffer.concat(stderrbufs).toString();

      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(stderr));
      }
    });
  });
}
