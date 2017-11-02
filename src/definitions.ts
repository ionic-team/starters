export interface StarterManifest {
  name: string;
  baseref: string;
  welcome?: string;
  dependencies?: { [key: string]: string; };
}

export interface PackageJson {
  dependencies: { [key: string]: string; };
}
