export interface StarterList {
  starters: {
    name: string;
    id: string;
    type: string;
  }[];
  integrations: {
    name: string;
    id: string;
  }[];
}

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
