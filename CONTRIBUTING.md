# Contributing

## Getting Started

To get started, clone the repo, and install dependencies:

```bash
npm i
```

Then build using:

```bash
npm run src:build
```

or build and watch for changes using:

```bash
npm run src:watch
```

> [!NOTE]
> We use TypeScript, so the code must be compiled before it runs.

## Generating

You can generate the starters by running:

```bash
npm run starters:build -- --current
```

You can build a single starter by specifying the path:

```bash
npm run starters:build -- angular/official/tabs --current
```

* Starters are generated by overlaying starter files (located in
  `<type>/official/<name>/` or `<type>/community/<scope>/<name>/`) onto base
  files (located in `<type>/base/`) into the `build/` directory.
* If the `--current` flag is not passed to the build command, the base files will
  be checked out from the value of the `baseref`.
* The `baseref` is defined in the starter's manifest file, which is a special
  file that invokes additional operations on the generated starter files. [Example manifest file](https://github.com/ionic-team/starters/blob/7bcf9aa56289f36a5f03ed24bed76ba8c3ac89fe/vue/official/list/ionic.starter.json#L3).

## Previewing

You can preview the starters by navigating to the `build` directory and running `ls` to find the name of the starter you want to preview:

```bash
cd build/
ls
```

The commands to serve the app differ slightly based on the framework. View each framework's commands below.

### Angular

Navigate into the starter's directory, install dependencies, then serve the app:

```bash
cd angular-official-list/
npm i
npm run start
```

> [!NOTE]
> Navigate to http://localhost:4200/ in your browser to preview the app.

### React

Navigate into the starter's directory, install dependencies, then serve the app:

```bash
cd react-official-list/
npm i
npm run start
```

> [!NOTE]
> The browser will automatically open a tab and navigate to http://localhost:3000/ to preview the app.

### React Vite

Navigate into the starter's directory, install dependencies, then serve the app:

```bash
cd react-vite-official-list/
npm i
npm run dev
```

> [!NOTE]
> The URL to preview the app defaults to http://localhost:5173/ unless that port is in use. The exact URL will be displayed after running the dev server.

### Vue

Navigate into the starter's directory, install dependencies, then serve the app:

```bash
cd vue-official-list/
npm i
npm run serve
```

> [!NOTE]
> Navigate to http://localhost:8080/ in your browser to preview the app.

### Vue Vite

Navigate into the starter's directory, install dependencies, then serve the app:

```bash
cd vue-vite-official-list/
npm i
npm run dev
```

> [!NOTE]
> The URL to preview the app defaults to http://localhost:5173/ unless that port is in use. The exact URL will be displayed after running the dev server.

## Testing

You can test starters by running:

```bash
npm run starters:test
```

You can test a single starter by specifying the starter ID (also the starter's
directory name within the `build/` directory):

```bash
npm run starters:test -- angular-official-tabs
```

* Starters must be generated before they can be tested. The test command works
  with starters generated in the `build/` directory.
* To test a starter, first the dependencies are installed (`npm install`), and
  then the `scripts.test` key in the starter's manifest file is executed. This
  way, each starter can define how it must be tested.

### Manifest Files

The starter manifest file (named `ionic.starter.json`) is a required JSON file
at the root of the starter. The build process reads the manifest and takes
actions based upon what's defined in the file.

| Key            | Description
|----------------|-------------
| `name`         | The human-readable name.
| `baseref`      | The latest git ref (branch or sha) at which the starter is compatible with the base files (located in `<type>/base/`).
| `welcome`      | _(optional)_ A custom message to be displayed when the user runs `ionic start` on the starter. See [Starter Welcome](#starter-welcome).
| `gitignore`    | _(optional)_ During build, the defined array of strings will be added to the bottom of the project's `.gitignore` file.
| `packageJson`  | _(optional)_ During build, the defined keys will be recursively merged into the generated `package.json`.
| `tsconfigJson` | _(optional)_ During build, the defined keys will be recursively merged into the generated `tsconfig.json`.
| `tarignore`    | _(optional)_ During deploy, the defined array of strings will be interpreted as globs to ignore files to include in the tar file when deployed.
| `scripts`      | _(optional)_ An object of scripts that run during build or deploy.
| `scripts.test` | _(optional)_ During test, after dependencies are installed, the defined script will be executed to test the starter.

### Community Starters

To submit your own starter,

1. Fork this repo.
1. Fork or copy the [Example
   Starter](https://github.com/ionic-team/starter-example).
1. Add a git submodule for your starter at `<type>/community/<your github
   name>/<github repo name>`. For example:

    ```bash
    git submodule add https://github.com/ionic-team/starter-example.git ionic-angular/community/ionic-team/example
    ```

1. Build your starter. For example:

    ```bash
    npm run starters:build -- ionic-angular/community/ionic-team/example
    ```

1. Copy the generated starter into a different directory and test it!

To update your starter,

1. Push changes to your starter repo freely.
1. Run `git pull` in your starters fork directory
   (`ionic-angular/community/ionic-team/example` for example).
1. Commit the changes to your fork and create a PR.

Tips:

* When you `cd` into a git submodule directory (i.e.
  `ionic-angular/community/ionic-team/example`), git commands operate on the
  submodule as its own repository.
* Inside a submodule folder, `git remote add local /path/to/starter/at/local`
  will add a new [git remote](https://git-scm.com/docs/git-remote) which you can
  use to pull local changes in. Make commits in your local starter repo, then
  `git pull local`.
* New commits in a submodule must also be saved in the base repository for PRs.
* Don't include a `.gitignore` file. If you need to ignore some files in your
  starter repo, you can use the private gitignore file located at
  `.git/info/exclude`. If you need to add entries, you can use the `gitignore`
  key in your manifest file.

### Starter Welcome

For a custom message to be displayed for your starter during `ionic start`, you
can set the `welcome` key of your starter manifest file to a string. For
terminal colors and other formatting, you can create a quick script to generate
the message, JSON-encode it, and copy it into your manifest file. See [this
example
script](https://github.com/ionic-team/starters/tree/master/ionic-angular/official/super.welcome.js)
for the Super Starter.

## Deploying (Automatic through CI)

Starters are deployed automatically when new commits are pushed to the `master`
branch.

During the deploy process, the `build/` directory is read and an archive of each
generated starter is created and gzipped and uploaded to an S3 bucket. The S3
bucket has a CloudFront distribution for close-proximity downloads. The
distribution ID is `E1XZ2T0DZXJ521` and can be found [at this
URL](https://d2ql0qc7j8u4b2.cloudfront.net).

## Deploying (Manually)

First, make sure you pull down the latest community starter submodules by running:

```bash
git pull --recurse-submodules
```

If you have not already initialized the submodules locally run:

```bash
git submodule update --init --recursive
```

Then run:

```bash
npm run starters:deploy
```

You can use `npm run starters:deploy -- --dry` to test the tar process.

By default, starters are deployed to the `testing` "tag" (`latest` is
production). You can install tagged starters by specifying the `--tag=<tag>`
option to `ionic start`).

> Note you will need permissions to the S3 bucket to manually deploy
