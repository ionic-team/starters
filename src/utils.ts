import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util'

import chalk from 'chalk';

import { PackageJson, StarterManifest } from './definitions';

const statp = util.promisify(fs.stat);
const readdirp = util.promisify(fs.readdir);
const readFilep = util.promisify(fs.readFile);

export async function getDirectories(p: string): Promise<string[]> {
  const contents = await readdirp(p);
  const stats = await Promise.all(contents.map(async (f): Promise<[string, fs.Stats]> => [f, await statp(path.resolve(p, f))]));
  return stats.filter(([f, stats]) => stats.isDirectory()).map(([f,]) => path.resolve(p, f));
}

export async function readPackageJson(p: string): Promise<PackageJson> {
  const contents = await readFile(p);

  if (!contents) {
    throw new Error(`Error with file: ${p}`);
  }

  return JSON.parse(contents);
}

export async function readStarterManifest(p: string): Promise<StarterManifest> {
  const contents = await readFile(p);

  if (!contents) {
    throw new Error(`No starter manifest found at: ${p}`);
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
