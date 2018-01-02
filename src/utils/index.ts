import * as fs from 'fs';
import * as path from 'path';

import chalk from 'chalk';
import { spawn } from 'cross-spawn';

import { fsReadDir, fsReadFile, fsStat } from '@ionic/cli-framework/utils/fs';

import { TsconfigJson, StarterManifest } from '../definitions';

export async function getDirectories(p: string): Promise<string[]> {
  const contents = await fsReadDir(p);
  const stats = await Promise.all(contents.map(async (f): Promise<[string, fs.Stats]> => [f, await fsStat(path.resolve(p, f))]));
  return stats.filter(([f, stats]) => stats.isDirectory()).map(([f,]) => path.resolve(p, f));
}

export async function readTsconfigJson(dir: string): Promise<TsconfigJson> {
  const contents = await fsReadFile(path.resolve(dir, 'tsconfig.json'), { encoding: 'utf8' });

  if (!contents) {
    return {};
  }

  return JSON.parse(contents);
}

export async function readGitignore(dir: string): Promise<string[]> {
  const contents = await fsReadFile(path.resolve(dir, '.gitignore'), { encoding: 'utf8' });

  if (!contents) {
    return [];
  }

  return contents.split(/\n/);
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
