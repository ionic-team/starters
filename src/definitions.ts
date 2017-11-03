export interface StarterManifest {
  name: string;
  baseref: string;
  welcome?: string;
  packageJson?: PackageJson;
}

export interface PackageJson {
  dependencies?: { [key: string]: string; };
  devDependencies?: { [key: string]: string; };
}
