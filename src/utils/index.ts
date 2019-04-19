import * as path from 'path';

import chalk from 'chalk';
import { SpawnOptions, spawn } from 'cross-spawn';

import { filter } from '@ionic/utils-array';
import { readFile, readdir, stat } from '@ionic/utils-fs';

import { StarterManifest, TsconfigJson } from '../definitions';

export const IONIC_MANIFEST_FILE = 'ionic.starter.json';

export function getCommandHeader(title: string): string {
  const separator = '-'.repeat(title.length);

  return (
    `${separator}\n` +
    `${chalk.cyan.bold(title)}\n` +
    `${separator}\n`
  );
}

export async function getDirectories(p: string): Promise<string[]> {
  const contents = await readdir(p);
  return filter(contents.map(f => path.resolve(p, f)), async f => (await stat(f)).isDirectory());
}

export async function readTsconfigJson(dir: string): Promise<TsconfigJson> {
  try {
    return JSON.parse(await readFile(path.resolve(dir, 'tsconfig.json'), { encoding: 'utf8' }));
  } catch (e) {
    // ignore
  }

  return {};
}

export async function readGitignore(dir: string): Promise<string[]> {
  try {
    return (await readFile(path.resolve(dir, '.gitignore'), { encoding: 'utf8' })).split(/\n/);
  } catch (e) {
    // ignore
  }

  return [];
}

export async function readStarterManifest(dir: string): Promise<StarterManifest | undefined> {
  try {
    return JSON.parse(await readFile(path.resolve(dir, IONIC_MANIFEST_FILE), { encoding: 'utf8' }));
  } catch (e) {
    // ignore
  }
}

export async function log(id: string, msg: string) {
  console.log(chalk.dim('=>'), chalk.cyan(id), msg);
}

export function runcmd(command: string, args?: string[], opts?: SpawnOptions): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const p = spawn(command, args, opts);

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
