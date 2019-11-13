import { PackageJson } from '@ionic/cli-framework';

export interface StarterList {
  starters: {
    name: string;
    id: string;
    type: string;
    ref: string;
    sha1: string;
  }[];
  integrations: {
    name: string;
    id: string;
  }[];
}

export interface StarterManifest {
  name: string;
  baseref: string;
  tarignore?: string[];
  scripts?: {
    test?: string;
  };
  welcome?: string;
  packageJson?: PackageJson;
  tsconfigJson?: TsconfigJson;
  gitignore?: string[];
}

export type TsconfigJson = TsconfigBase & (TsconfgFiles | TsconfigExclude | TsconfigInclude);

export interface TsconfigBase {
  compilerOptions?: {
    charset?: string;
    declaration?: boolean;
    declarationDir?: string;
    diagnostics?: boolean;
    emitBOM?: boolean;
    inlineSourceMap?: boolean;
    inlineSources?: boolean;
    jsx?: 'preserve' | 'react' | 'react-native';
    reactNamespace?: string;
    listFiles?: boolean;
    mapRoot?: string;
    module?: 'commonjs' | 'amd' | 'umd' | 'system' | 'es6' | 'es2015' | 'esnext' | 'none';
    newLine?: 'CRLF' | 'LF';
    noEmit?: boolean;
    noEmitHelpers?: boolean;
    noEmitOnError?: boolean;
    noImplicitAny?: boolean;
    noImplicitThis?: boolean;
    noUnusedLocals?: boolean;
    noUnusedParameters?: boolean;
    noLib?: boolean;
    noResolve?: boolean;
    noStrictGenericChecks?: boolean;
    skipDefaultLibCheck?: boolean;
    skipLibCheck?: boolean;
    outFile?: string;
    outDir?: string;
    preserveConstEnums?: boolean;
    preserveSymlinks?: boolean;
    pretty?: boolean;
    removeComments?: boolean;
    rootDir?: string;
    isolatedModules?: boolean;
    sourceMap?: boolean;
    sourceRoot?: string;
    suppressExcessPropertyErrors?: boolean;
    suppressImplicitAnyIndexErrors?: boolean;
    stripInternal?: boolean;
    target?: 'es3' | 'es5' | 'es2015' | 'es2016' | 'es2017' | 'esnext';
    watch?: boolean;
    experimentalDecorators?: boolean;
    emitDecoratorMetadata?: boolean;
    moduleResolution?: 'classic' | 'node';
    allowUnusedLabels?: boolean;
    noImplicitReturns?: boolean;
    noFallthroughCasesInSwitch?: boolean;
    allowUnreachableCode?: boolean;
    forceConsistentCasingInFileNames?: boolean;
    baseUrl?: string;
    paths?: {
      [k: string]: any;
    };
    plugins?: {
      name?: string;
      [k: string]: any;
    }[];
    rootDirs?: string[];
    typeRoots?: string[];
    types?: string[];
    traceResolution?: boolean;
    allowJs?: boolean;
    allowSyntheticDefaultImports?: boolean;
    noImplicitUseStrict?: boolean;
    listEmittedFiles?: boolean;
    lib?: (
      | 'es5'
      | 'es6'
      | 'es2015'
      | 'es7'
      | 'es2016'
      | 'es2017'
      | 'esnext'
      | 'dom'
      | 'dom.iterable'
      | 'webworker'
      | 'scripthost'
      | 'es2015.core'
      | 'es2015.collection'
      | 'es2015.generator'
      | 'es2015.iterable'
      | 'es2015.promise'
      | 'es2015.proxy'
      | 'es2015.reflect'
      | 'es2015.symbol'
      | 'es2015.symbol.wellknown'
      | 'es2016.array.include'
      | 'es2017.object'
      | 'es2017.sharedmemory'
      | 'esnext.asynciterable')[];
    strictNullChecks?: boolean;
    maxNodeModuleJsDepth?: number;
    importHelpers?: boolean;
    jsxFactory?: string;
    alwaysStrict?: boolean;
    strict?: boolean;
    downlevelIteration?: boolean;
    checkJs?: boolean;
    strictFunctionTypes?: boolean;
  };
  compileOnSave?: boolean;
  typeAcquisition?: {
    enable?: boolean;
    include?: string[];
    exclude?: string[];
  };
  extends?: string;
}

export interface TsconfgFiles {
  files?: string[];
}
export interface TsconfigExclude {
  exclude?: string[];
}
export interface TsconfigInclude {
  include?: string[];
}
