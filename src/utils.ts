import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util'

import chalk from 'chalk';
import { spawn } from 'cross-spawn';
import * as rimraf from 'rimraf';
import * as ncp from 'ncp';

import { PackageJson, StarterManifest } from './definitions';

export const mkdirp = util.promisify(fs.mkdir);
export const readFilep = util.promisify(fs.readFile);
export const readdirp = util.promisify(fs.readdir);
export const renamep = util.promisify(fs.rename);
export const statp = util.promisify(fs.stat);
export const unlink = util.promisify(fs.unlink);
export const writeFilep = util.promisify(fs.writeFile);

export const ncpp: (s: string, d: string, o?: ncp.Options) => void = <any>util.promisify(ncp.ncp);
export const rimrafp: (p: string) => void = <any>util.promisify(rimraf);

export async function getDirectories(p: string): Promise<string[]> {
  const contents = await readdirp(p);
  const stats = await Promise.all(contents.map(async (f): Promise<[string, fs.Stats]> => [f, await statp(path.resolve(p, f))]));
  return stats.filter(([f, stats]) => stats.isDirectory()).map(([f,]) => path.resolve(p, f));
}

export async function readPackageJson(dir: string): Promise<PackageJson> {
  const contents = await readFile(path.resolve(dir, 'package.json'));

  if (!contents) {
    throw new Error(`No package.json found in directory: ${dir}`);
  }

  return JSON.parse(contents);
}

export async function readStarterManifest(dir: string): Promise<StarterManifest> {
  const contents = await readFile(path.resolve(dir, 'ionic.starter.json'));

  if (!contents) {
    throw new Error(`No starter manifest found in directory: ${dir}`);
  }

  return JSON.parse(contents);
}

export async function readFile(p: string): Promise<string | undefined> {
  try {
    const stats = await statp(p);

    if (!stats.isFile()) {
      return;
    }
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }

    return;
  }

  return readFilep(p, { encoding: 'utf8' });
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
