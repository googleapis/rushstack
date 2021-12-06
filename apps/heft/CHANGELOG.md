# Change Log - @rushstack/heft

This log was last generated on Mon, 06 Dec 2021 16:08:32 GMT and should not be manually modified.

## 0.42.5
Mon, 06 Dec 2021 16:08:32 GMT

_Version update only_

## 0.42.4
Fri, 03 Dec 2021 03:05:22 GMT

_Version update only_

## 0.42.3
Mon, 29 Nov 2021 07:26:16 GMT

### Patches

- Remove an unused dependency.

## 0.42.2
Sat, 06 Nov 2021 00:09:13 GMT

_Version update only_

## 0.42.1
Fri, 05 Nov 2021 15:09:18 GMT

_Version update only_

## 0.42.0
Thu, 28 Oct 2021 00:08:22 GMT

### Minor changes

- Add environment variables for common heft test parameters

## 0.41.8
Wed, 27 Oct 2021 00:08:15 GMT

### Patches

- Update the package.json repository field to include the directory property.

## 0.41.7
Wed, 13 Oct 2021 15:09:54 GMT

_Version update only_

## 0.41.6
Fri, 08 Oct 2021 09:35:07 GMT

### Patches

- Fix reuse of TypeScript program to avoid breaking on older versions of @typescript-eslint/typescript-estree

## 0.41.5
Fri, 08 Oct 2021 08:08:34 GMT

_Version update only_

## 0.41.4
Thu, 07 Oct 2021 23:43:12 GMT

### Patches

- Re-use the compiler TypeScript program when running ESLint to reduce overhead

## 0.41.3
Thu, 07 Oct 2021 07:13:35 GMT

### Patches

- Fix support for TypeScript 4.4 in --watch mode.

## 0.41.2
Wed, 06 Oct 2021 15:08:25 GMT

### Patches

- Improve the HeftSession.commandLine.register<Type>Parameter interface and add support for choice and choice list parameters. 

## 0.41.1
Wed, 06 Oct 2021 02:41:48 GMT

### Patches

- Replace ITerminal with Terminal in data structure values to preserve compatability with plugins written before ITerminal.

## 0.41.0
Tue, 05 Oct 2021 15:08:37 GMT

### Minor changes

- Use ITerminal instead of Terminal to allow for compatibility with other versions of @rushstack/node-core-library.

## 0.40.0
Mon, 04 Oct 2021 15:10:18 GMT

### Minor changes

- Add register custom parameters feature to Heft.

## 0.39.2
Fri, 24 Sep 2021 00:09:29 GMT

_Version update only_

## 0.39.1
Thu, 23 Sep 2021 00:10:40 GMT

### Patches

- Upgrade the `@types/node` dependency to version to version 12.

## 0.39.0
Wed, 22 Sep 2021 03:27:12 GMT

### Minor changes

- Add "encounteredErrors" boolean to IMetricsData.

### Patches

- Fix typo in temp folder path.

## 0.38.2
Wed, 22 Sep 2021 00:09:32 GMT

### Patches

- Fix formatting of tsBuildInfoFile tsconfig option. TypeScript uses an exact string match for change detection and normalizes slashes to '/' upon saving the file. Therefore the inputs need to be normalized as well.

## 0.38.1
Sat, 18 Sep 2021 03:05:57 GMT

### Patches

- Fix an issue where setting the emitMjsExtensionForESModule typescript.json option in a project whose tsconfig emits CommonJS will only emit .mjs files.

## 0.38.0
Tue, 14 Sep 2021 01:17:04 GMT

### Minor changes

- Temoprarily introduce a "--storybook" CLI parameter to support the experimental heft-storybook-plugin

## 0.37.4
Mon, 13 Sep 2021 15:07:05 GMT

_Version update only_

## 0.37.3
Fri, 10 Sep 2021 15:08:28 GMT

### Patches

- Support ESLint configuration in .eslintrc.cjs (instead of .eslintrc.js) to support projects with ESM modules ("type": "module" in package.json).

## 0.37.2
Wed, 08 Sep 2021 19:06:22 GMT

_Version update only_

## 0.37.1
Wed, 08 Sep 2021 00:08:03 GMT

### Patches

- Fix building for Typescript 4.4 (Error: directoryExists is not a function)
- Ensure `process.cwd()` is set to the project root with correct file path casing.

## 0.37.0
Tue, 31 Aug 2021 00:07:11 GMT

### Minor changes

- Add commandParameters to IMetricsData for recording parameter usage

## 0.36.4
Fri, 27 Aug 2021 00:07:25 GMT

_Version update only_

## 0.36.3
Fri, 20 Aug 2021 15:08:10 GMT

_Version update only_

## 0.36.2
Thu, 12 Aug 2021 18:11:18 GMT

### Patches

- Fix an issue with the TypeScript compilation when Heft is invoked in a terminal with incorrect casing in the CWD.

## 0.36.1
Thu, 12 Aug 2021 01:28:38 GMT

### Patches

- Restore automatic generation of tsBuildInfo.json file path to work around odd path resolution behavior.

## 0.36.0
Wed, 11 Aug 2021 23:14:17 GMT

### Minor changes

- Add support to TypeScriptPlugin for composite TypeScript projects, with behavior analogous to "tsc --build".
- Retired the use of the .heft/build-cache folder for persisting build state across the "heft clean" or "--clean" invocation. Incremental TypeScript compilation is now performed either by running "heft build" (without "--clean"), or using watch mode, and requires the tsconfig to manually opt in. The feature reduced performance of cold builds and introduced bugs due to stale caches that confused users.

## 0.35.1
Wed, 11 Aug 2021 00:07:21 GMT

_Version update only_

## 0.35.0
Sat, 31 Jul 2021 00:52:11 GMT

### Minor changes

- (BREAKING CHANGE) Extract default Sass plugin to separate @rushstack/heft-sass-plugin package

## 0.34.8
Wed, 14 Jul 2021 15:06:29 GMT

_Version update only_

## 0.34.7
Tue, 13 Jul 2021 23:00:33 GMT

_Version update only_

## 0.34.6
Mon, 12 Jul 2021 23:08:26 GMT

### Patches

- Disable eslint for no-unused-vars

## 0.34.5
Thu, 08 Jul 2021 23:41:16 GMT

_Version update only_

## 0.34.4
Thu, 08 Jul 2021 06:00:48 GMT

_Version update only_

## 0.34.3
Thu, 01 Jul 2021 15:08:27 GMT

_Version update only_

## 0.34.2
Wed, 30 Jun 2021 15:06:54 GMT

_Version update only_

## 0.34.1
Wed, 30 Jun 2021 01:37:17 GMT

_Version update only_

## 0.34.0
Fri, 25 Jun 2021 00:08:28 GMT

### Minor changes

- Add RunScriptPlugin to allow for running custom scripts specified in "heft.json". Specified as a "runScript" event in the "heftEvents" field, paths to scripts are resolved relative to the root of the project they are specified in.

## 0.33.1
Fri, 18 Jun 2021 06:23:05 GMT

### Patches

- Fix a regression where Heft sometimes failed with "No tests found, exiting with code 1"

## 0.33.0
Wed, 16 Jun 2021 15:07:24 GMT

### Minor changes

- (BREAKING CHANGE) Simplify the plugin event hook lifecycle by eliminating an experimental feature that enabled side-by-side compiler configurations. We decided that this scenario is better approached by splitting the files into separate projects.
- (BREAKING CHANGE) Remove the "afterEachIteration" compile substage and replace its functionality with a more versatile "afterRecompile" compile substage hook.

## 0.32.0
Fri, 11 Jun 2021 00:34:02 GMT

### Minor changes

- (BREAKING CHANGE) Remove Jest plugin from Heft. To consume the Jest plugin, add @rushstack/heft-jest-plugin as a dependency and include it in heft.json. See UPGRADING.md for more information.

## 0.31.5
Thu, 10 Jun 2021 15:08:15 GMT

### Patches

- Update the version compatibility warning to indicate that TypeScript 4.x is supported by Heft

## 0.31.4
Fri, 04 Jun 2021 19:59:53 GMT

### Patches

- Add IBuildStage output property 'isTypeScriptProject' and populate in TypeScriptPlugin
- Fix bug in CopyFilesPlugin that caused 0-length files to be generated

## 0.31.3
Fri, 04 Jun 2021 15:08:20 GMT

_Version update only_

## 0.31.2
Fri, 04 Jun 2021 00:08:34 GMT

_Version update only_

## 0.31.1
Tue, 01 Jun 2021 18:29:25 GMT

### Patches

- Fix an issue where NodeServicePlugin launched the service when "heft build --watch" was invoked

## 0.31.0
Sat, 29 May 2021 01:05:06 GMT

### Minor changes

- Add a new "node-service" task that enables "heft start" to launch a Node.js service (GitHub #2717)

## 0.30.7
Fri, 28 May 2021 06:19:57 GMT

### Patches

- Prepare to split JestPlugin into a dedicated package

## 0.30.6
Tue, 25 May 2021 00:12:21 GMT

### Patches

- Report an error to prevent two different TypeScript module kinds from being emitted into nested folders

## 0.30.5
Wed, 19 May 2021 00:11:39 GMT

_Version update only_

## 0.30.4
Thu, 13 May 2021 01:52:46 GMT

### Patches

- Fix an issue where Heft would return only the sourcemap if the compiled .js file is missing the sourceMappingURL comment.

## 0.30.3
Tue, 11 May 2021 22:19:17 GMT

### Patches

- Fix the "sources" paths in emitted sourcemap files.

## 0.30.2
Mon, 03 May 2021 15:10:28 GMT

### Patches

- Move forEachLimitAsync implementation out of heft

## 0.30.1
Thu, 29 Apr 2021 23:26:50 GMT

_Version update only_

## 0.30.0
Thu, 29 Apr 2021 01:07:29 GMT

### Minor changes

- Add a command-line option "--detect-open-handles" for troubleshooting Jest issues

### Patches

- Implement a workaround for an intermittent Jest error "A worker process has failed to exit gracefully and has been force exited." (Jest issue #11354)

## 0.29.1
Fri, 23 Apr 2021 22:00:06 GMT

### Patches

- Ensure TypeScript uses file paths with correct casing.

## 0.29.0
Fri, 23 Apr 2021 15:11:20 GMT

### Minor changes

- Add emitCjsExtensionForCommonJS and emitMjsExtensionForESModule options to config/typescript.json to support emitting commonJS and ESModule output files with the ".cjs" and ".mjs" respectively, alongside the normal ".js" output files.

## 0.28.5
Wed, 21 Apr 2021 15:12:27 GMT

### Patches

- Fix an issue where an exception is thrown when running multiple TypeScript compilations in --debug mode

## 0.28.4
Tue, 20 Apr 2021 04:59:51 GMT

_Version update only_

## 0.28.3
Thu, 15 Apr 2021 02:59:25 GMT

### Patches

- Fix incremental TypeScript compilation, optimize architecture

## 0.28.2
Mon, 12 Apr 2021 15:10:29 GMT

_Version update only_

## 0.28.1
Thu, 08 Apr 2021 20:41:54 GMT

### Patches

- Include mention of heft-webpack5-plugin in an error message.

## 0.28.0
Thu, 08 Apr 2021 06:05:31 GMT

### Minor changes

- Fix parameter name typo.

## 0.27.0
Thu, 08 Apr 2021 00:10:18 GMT

### Minor changes

- (BREAKING) Move Webpack functionality into its own package (@rushstack/heft-webpack4-plugin).

## 0.26.0
Tue, 06 Apr 2021 15:14:22 GMT

### Minor changes

- Add an "afterCompile" hook that runs after compilation.

## 0.25.5
Wed, 31 Mar 2021 15:10:36 GMT

### Patches

- Fix an outdated path in an error message.

## 0.25.4
Mon, 29 Mar 2021 05:02:06 GMT

_Version update only_

## 0.25.3
Fri, 19 Mar 2021 22:31:37 GMT

### Patches

- Improve README.md

## 0.25.2
Wed, 17 Mar 2021 05:04:37 GMT

### Patches

- Fix an issue where heft would crash when copying static assets in --watch mode.

## 0.25.1
Fri, 12 Mar 2021 01:13:27 GMT

### Patches

- Update node-sass to support Node 15.

## 0.25.0
Wed, 10 Mar 2021 05:10:05 GMT

### Minor changes

- (BREAKING CHANGE) Change the logic that resolves typescript, eslint, tslint, and api-extractor to look for a devDependency in the current project, and then for a dependency in the rig project, and then as any kind of dependency in the current project.

## 0.24.4
Thu, 04 Mar 2021 01:11:31 GMT

_Version update only_

## 0.24.3
Tue, 02 Mar 2021 23:25:05 GMT

### Patches

- Fix an issue where build would continue even if TS reported errors.
- Determine the default static assets destination folder from the TSConfig's "outDir" property, instead of hardcoding "lib."

## 0.24.2
Fri, 05 Feb 2021 16:10:42 GMT

_Version update only_

## 0.24.1
Fri, 22 Jan 2021 05:39:22 GMT

### Patches

- Fix an issue with webpack in "heft start" mode where "bundle" would continue too quickly.

## 0.24.0
Thu, 21 Jan 2021 04:19:00 GMT

### Minor changes

- Update jest-shared.config.json to specify a default "collectCoverageFrom" that includes all "src" files excluding test files
- Update jest-shared.config.json to configure "coverageDirectory" to use "./temp/coverage" (instead of "./coverage")

## 0.23.2
Wed, 13 Jan 2021 01:11:06 GMT

_Version update only_

## 0.23.1
Wed, 06 Jan 2021 16:10:43 GMT

_Version update only_

## 0.23.0
Mon, 14 Dec 2020 16:12:20 GMT

### Minor changes

- Delay build stages in --watch mode until the previous stage reports an initial completion.

## 0.22.7
Thu, 10 Dec 2020 23:25:49 GMT

### Patches

- Fix an issue where using CTRL+C to terminate "--watch" mode would sometimes leave a background process running (GitHub #2387)

## 0.22.6
Sat, 05 Dec 2020 01:11:23 GMT

_Version update only_

## 0.22.5
Tue, 01 Dec 2020 01:10:38 GMT

### Patches

- Fix a typo in a logging message.

## 0.22.4
Mon, 30 Nov 2020 16:11:49 GMT

_Version update only_

## 0.22.3
Wed, 18 Nov 2020 08:19:54 GMT

_Version update only_

## 0.22.2
Wed, 18 Nov 2020 06:21:58 GMT

_Version update only_

## 0.22.1
Tue, 17 Nov 2020 01:17:38 GMT

### Patches

- Fix an issue where .map files were not being published

## 0.22.0
Mon, 16 Nov 2020 01:57:58 GMT

### Minor changes

- Add "webpack-dev-server" as a dependency since its types are part of Heft's API contract

### Patches

- Fix an issue where API Extractor errors/warnings did not show the message ID

## 0.21.3
Fri, 13 Nov 2020 01:11:00 GMT

### Patches

- Update Sass typings generation to update in watch mode when a dependency changes.

## 0.21.2
Thu, 12 Nov 2020 01:11:10 GMT

### Patches

- Fix a minor issue with heft.schema.json

## 0.21.1
Wed, 11 Nov 2020 01:08:58 GMT

_Version update only_

## 0.21.0
Tue, 10 Nov 2020 23:13:11 GMT

### Minor changes

- Add new built-in Heft action "copyFiles" to copy or hardlink files during specified Heft events

### Patches

- Fix an incorrectly formatted error message

## 0.20.1
Tue, 10 Nov 2020 16:11:42 GMT

### Patches

- Improve error handling and make --debug print stacks of errors that occur in heft's internal initialization.

## 0.20.0
Sun, 08 Nov 2020 22:52:49 GMT

### Minor changes

- Update jest-shared.config.json with more file extension mappings for "jest-string-mock-transform"

## 0.19.5
Fri, 06 Nov 2020 16:09:30 GMT

### Patches

- Fix an issue where an extended "typescript.json" config file with omitted optional staticAssetsToCopy fields would cause schema validation to fail.

## 0.19.4
Tue, 03 Nov 2020 01:11:18 GMT

### Patches

- Update README.md

## 0.19.3
Mon, 02 Nov 2020 16:12:05 GMT

### Patches

- Honor jest reporters specified in config/jest.config.json

## 0.19.2
Fri, 30 Oct 2020 06:38:39 GMT

_Version update only_

## 0.19.1
Fri, 30 Oct 2020 00:10:14 GMT

_Version update only_

## 0.19.0
Thu, 29 Oct 2020 06:14:19 GMT

### Minor changes

- Upgrade @types/tapable and @types/webpack

## 0.18.0
Thu, 29 Oct 2020 00:11:33 GMT

### Minor changes

- Update Webpack dependency to ~4.44.2

## 0.17.4
Wed, 28 Oct 2020 01:18:03 GMT

_Version update only_

## 0.17.3
Tue, 27 Oct 2020 15:10:13 GMT

_Version update only_

## 0.17.2
Sat, 24 Oct 2020 00:11:18 GMT

### Patches

- Add fileExtensions config to SassTypingsGenerator. 

## 0.17.1
Wed, 21 Oct 2020 05:09:44 GMT

### Patches

- Bump downstream dependencies.

## 0.17.0
Fri, 16 Oct 2020 23:32:58 GMT

### Minor changes

- Allow the Webpack dev server configuration to be customized.

## 0.16.1
Thu, 15 Oct 2020 00:59:08 GMT

_Version update only_

## 0.16.0
Wed, 14 Oct 2020 23:30:14 GMT

### Minor changes

- (BREAKING CHANGE) Rename "includePaths" to "importIncludePaths" in sass.json.

### Patches

- Add an "exclude" option to sass.json.

## 0.15.8
Tue, 13 Oct 2020 15:11:28 GMT

### Patches

- Fix an issue where heftSession.debugMode isn't set properly.

## 0.15.7
Mon, 12 Oct 2020 15:11:16 GMT

### Patches

- Include additionalModuleKindsToEmit in the copy-static-assets plugin destination folders.
- Throw if jest config file doesn't exist

## 0.15.6
Fri, 09 Oct 2020 15:11:08 GMT

### Patches

- Support relative imports in the Sass typings generator.

## 0.15.5
Tue, 06 Oct 2020 00:24:06 GMT

_Version update only_

## 0.15.4
Mon, 05 Oct 2020 22:36:57 GMT

_Version update only_

## 0.15.3
Mon, 05 Oct 2020 15:10:42 GMT

_Version update only_

## 0.15.2
Fri, 02 Oct 2020 00:10:59 GMT

### Patches

- Include UPGRADING.md in npm package publish.

## 0.15.1
Thu, 01 Oct 2020 20:27:16 GMT

_Version update only_

## 0.15.0
Thu, 01 Oct 2020 18:51:21 GMT

### Minor changes

- Add functionality to automatically generate typings for *.scss, *.sass, and *.css files.

## 0.14.1
Wed, 30 Sep 2020 18:39:17 GMT

### Patches

- Update to build with @rushstack/heft-node-rig
- Reclassify compiler messages TS2564 and TS7053 as warnings instead of errors
- Print a warning if the API Extractor version is too old

## 0.14.0
Wed, 30 Sep 2020 06:53:53 GMT

### Minor changes

- (BREAKING CHANGE) Collapse copy-static-assets.json into typescript.json.
- (BREAKING CHANGE) Move the config files from the ".heft" folder to the "config" folder and print a warning if an unexpected file is found in the ".heft" folder.
- (BREAKING CHANGE) Consolidate the clean.json and plugins.json files into a new heft.json file.
- (BREAKING CHANGE) Rename "emitFolderNameForJest" to "emitFolderNameForTests" in typescript.json
- Heft now supports the config/rig.json system as defined by @rushstack/rig-package
- Enable api-extractor.json to be provided by a rig package
- Upgrade compiler; the API now requires TypeScript 3.9 or newer

### Patches

- Update README.md
- Fix an issue where "heft build --help" printed incorrect help

## 0.13.9
Tue, 22 Sep 2020 05:45:56 GMT

### Patches

- Make the "plugins" field of "plugins.json" optional.

## 0.13.8
Tue, 22 Sep 2020 01:45:31 GMT

_Version update only_

## 0.13.7
Tue, 22 Sep 2020 00:08:53 GMT

_Version update only_

## 0.13.6
Sat, 19 Sep 2020 04:37:27 GMT

_Version update only_

## 0.13.5
Sat, 19 Sep 2020 03:33:07 GMT

_Version update only_

## 0.13.4
Fri, 18 Sep 2020 22:57:24 GMT

### Patches

- Fix an issue where folders listed in pathsToDelete in clean.json weren't deleted on Windows.

## 0.13.3
Fri, 18 Sep 2020 21:49:53 GMT

### Patches

- Add a missing field to the template config files.
- Fix an issue where, if an "extends" field pointed to a module that didn't exist, the error was silently ignored.

## 0.13.2
Wed, 16 Sep 2020 05:30:25 GMT

### Patches

- Add missing "extends" properties to schemas.
- Fix an issue where console.log() did not get formatted by HeftJestReporter

## 0.13.1
Tue, 15 Sep 2020 01:51:37 GMT

### Patches

- Improve reliability of jest-build-transform.js by only comparing timestamps when in "--watch" mode

## 0.13.0
Mon, 14 Sep 2020 15:09:48 GMT

### Minor changes

- Enable support for Jest inline snapshots

## 0.12.0
Sun, 13 Sep 2020 01:53:20 GMT

### Minor changes

- Update plugins to load configuration via heft-configuration-loader instead of in central plugins.
- Remove the loading of common/config/heft/* config files.
- (BREAKING CHANGE) Rename the "outFolderPath" and "emitFolderPathForJest" properties in typescript.json to "outFolderName" and "emitFolderNameForJest"

## 0.11.1
Fri, 11 Sep 2020 02:13:35 GMT

_Version update only_

## 0.11.0
Wed, 09 Sep 2020 03:29:01 GMT

### Minor changes

- Add --max-workers option to the "test" action to control the maximum number of worker processes the test process can use.

## 0.10.5
Wed, 09 Sep 2020 00:38:48 GMT

### Patches

- Fix a typo in an error message to read that plugins must define a "pluginName" property, rather than the former "displayName" property

## 0.10.4
Mon, 07 Sep 2020 07:37:37 GMT

### Patches

- Fix an issue with WebpackPlugin loading webpack-dev-server in non-serve mode and setting the "WEBPACK_DEV_SERVER" environment variable.

## 0.10.3
Sat, 05 Sep 2020 18:56:35 GMT

### Patches

- Fix parsing of the --max-old-space-size build parameter.
- Fix parsing of the --plugin heft parameter.

## 0.10.2
Fri, 04 Sep 2020 15:06:27 GMT

### Patches

- Fix issues with parsing of tslint.json config files, including adding support for an array provided to "extends" and proper Node module resolution to extended config files.
- Fix a sourcemap issue that caused the debugger to show Jest files in a duplicate editor window (with the same path as the real file)

## 0.10.1
Thu, 03 Sep 2020 15:09:59 GMT

### Patches

- Fix an issue with Heft not printing an error message.

## 0.10.0
Wed, 02 Sep 2020 23:01:13 GMT

### Minor changes

- Add a simple way to specify a custom action.
- Remove the dev-deploy action from Heft

## 0.9.0
Wed, 02 Sep 2020 15:10:17 GMT

### Minor changes

- Add a method for plugins to hook into other plugins.
- BREAKING CHANGE: Rename the "displayName" plugin property to "pluginName"

## 0.8.0
Thu, 27 Aug 2020 11:27:06 GMT

### Minor changes

- Formalize the way extendable configuration files are loaded.
- Add a "setupFiles" setting to jest-shared.config.json, which implements the helper APIs from the @types/heft-jest package
- Add a "roots" setting to jest-shared.config.json, which enables "src/__mocks__" to be used for manually mocking Node.js system modules

### Patches

- Add a "modulePathIgnorePatterns" setting to jest-shared.config.json, which fixes a warning that was sometimes shown due to Jest loading extraneous files
- Add a "resolver" setting to jest-shared-config.json, which fixes an issue with importing manual mocks from a "__mocks__" subfolder. (See jest-improved-resolver.js for details.)

## 0.7.0
Tue, 25 Aug 2020 00:10:12 GMT

### Minor changes

- Adds a "--update-snapshots" command line flag which, when included, causes the test action to update the Jest snapshots. If this flag is omitted, tests with conditions that do not match the snapshots will fail. This replaces the older logic of using --production to prevent updating snapshots, which were otherwise updated.

## 0.6.6
Mon, 24 Aug 2020 07:35:20 GMT

_Version update only_

## 0.6.5
Sat, 22 Aug 2020 05:55:42 GMT

_Version update only_

## 0.6.4
Fri, 21 Aug 2020 01:21:17 GMT

### Patches

- Fix an issue with Heft exiting with exit code 0 after a CLI error.

## 0.6.3
Thu, 20 Aug 2020 18:41:47 GMT

### Patches

- Fix an issue where failed test suites aren't listed as failures.

## 0.6.2
Thu, 20 Aug 2020 15:13:52 GMT

### Patches

- Add the --notest parameter back to "heft test" temporarily.

## 0.6.1
Tue, 18 Aug 2020 23:59:42 GMT

_Version update only_

## 0.6.0
Tue, 18 Aug 2020 03:03:23 GMT

### Minor changes

- Add a "version selector" feature so that if a globally installed Heft binary is invoked, it will try to load the project's locally installed version of Heft

## 0.5.1
Mon, 17 Aug 2020 05:31:53 GMT

### Patches

- Fix a broken dependency

## 0.5.0
Mon, 17 Aug 2020 04:53:23 GMT

### Minor changes

- Formalize the way errors and warnings are emitted.
- Expose some useful Jest CLI parameters as "heft test" parameters
- Rename "--notest" to "--no--test"
- Improve "heft test" to show console output from tests

### Patches

- Normalize the way file paths are printed in errors and warnings.
- Ensure build steps that depend on emitted TS output aren't triggered until TS has written output to disk.
- Fix an issue where Heft could complete with errors but not return a nonzero process exit code
- Reclassify TypeScript messages such as "X is declared but never used" to be reported as warnings instead of errors

## 0.4.7
Thu, 13 Aug 2020 09:26:39 GMT

### Patches

- Fix a race condition where .js files were sometimes read by Jest before they were written by TypeScript
- Fix an issue where the TypeScript incremental build cache sometimes did not work correctly in "--watch" mode
- Add support for "additionalModuleKindsToEmit" in watch mode

## 0.4.6
Thu, 13 Aug 2020 04:57:38 GMT

### Patches

- Fix an issue with incorrect source maps for the Jest transform
- Fix a watch mode race condition where "--clean" ran in parallel with "heft test" (GitHub #2078)
- Fix an issue where "The transpiler output folder does not exist" was sometimes printed erroneously

## 0.4.5
Wed, 12 Aug 2020 00:10:05 GMT

_Version update only_

## 0.4.4
Tue, 11 Aug 2020 00:36:22 GMT

### Patches

- Fix an issue where emitted .js.map sourcemaps had an incorrect relative path (GitHub #2086)

## 0.4.3
Wed, 05 Aug 2020 18:27:33 GMT

_Version update only_

## 0.4.2
Tue, 04 Aug 2020 07:27:25 GMT

### Patches

- Update README.md logo

## 0.4.1
Mon, 03 Aug 2020 15:09:51 GMT

### Patches

- Add specific support for handling binary assets in Jest tests.

## 0.4.0
Mon, 03 Aug 2020 06:55:14 GMT

### Minor changes

- Add jest-identity-mock-transform for mocking .css imports in Webpack projects
- Add new "emitFolderPathForJest" setting in typescript.json, which simplifies how Webpack projects emit CommonJS for Jest

### Patches

- Fix an issue where jest-shared.config.json did not match .tsx file extensions
- Standardize how jest-shared.config.json references path-based imports
- Enable Jest "runInBand" when invoking Heft with "--debug"
- Fix an issue where "heft clean" did not clean Jest's unreliable cache

## 0.3.1
Thu, 30 Jul 2020 15:09:35 GMT

### Patches

- Emit errors and warnings from webpack.

## 0.3.0
Fri, 24 Jul 2020 20:40:38 GMT

### Minor changes

- Enable Heft to be used without the "@microsoft/rush-stack-compiler-n.n" system

## 0.2.2
Tue, 21 Jul 2020 00:54:55 GMT

### Patches

- Rename .heft/api-extractor.json to .heft/api-extractor-task.json to avoid confusion with API Extractor's config file

## 0.2.1
Tue, 21 Jul 2020 00:10:21 GMT

### Patches

- Update documentation

## 0.2.0
Mon, 20 Jul 2020 06:52:33 GMT

### Minor changes

- Make API Extractor's typescriptCompilerFolder option configurable.
- Include basic support for webpack-dev-server.

## 0.1.2
Thu, 16 Jul 2020 18:34:08 GMT

### Patches

- Republish to fix incorrect dependency specifier

## 0.1.1
Thu, 16 Jul 2020 17:53:35 GMT

### Patches

- Add support for TypeScript compilers older than version 3.6 (which do not support incremental compilation)

## 0.1.0
Wed, 15 Jul 2020 18:29:28 GMT

### Minor changes

- Initial release

