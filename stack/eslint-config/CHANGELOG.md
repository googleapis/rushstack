# Change Log - @rushstack/eslint-config

This log was last generated on Mon, 06 Dec 2021 16:08:32 GMT and should not be manually modified.

## 2.5.0
Mon, 06 Dec 2021 16:08:32 GMT

### Minor changes

- Temporarily disable eslint-plugin-promise until ESLint v8 support is added (https://github.com/xjamundx/eslint-plugin-promise/issues/218)

## 2.4.5
Fri, 05 Nov 2021 15:09:18 GMT

_Version update only_

## 2.4.4
Wed, 27 Oct 2021 00:08:15 GMT

### Patches

- Update the package.json repository field to include the directory property.

## 2.4.3
Wed, 13 Oct 2021 15:09:54 GMT

_Version update only_

## 2.4.2
Thu, 07 Oct 2021 07:13:35 GMT

### Patches

- Update typescript-eslint to add support for TypeScript 4.4.

## 2.4.1
Thu, 23 Sep 2021 00:10:40 GMT

_Version update only_

## 2.4.0
Mon, 12 Jul 2021 23:08:26 GMT

### Minor changes

- Upgrade @typescript-eslint/* packages to 4.28.0 (GitHub #2389)

## 2.3.4
Mon, 12 Apr 2021 15:10:28 GMT

_Version update only_

## 2.3.3
Tue, 06 Apr 2021 15:14:22 GMT

### Patches

- Switch to range version specifier for Typescript experimental utils

## 2.3.2
Thu, 10 Dec 2020 23:25:49 GMT

### Patches

- Upgrade to TSDoc 0.12.24

## 2.3.1
Wed, 11 Nov 2020 01:08:58 GMT

_Version update only_

## 2.3.0
Fri, 30 Oct 2020 06:38:38 GMT

### Minor changes

- Exclude *.d.ts from linting
- Set "root"=true to prevent unintended loading of other ESLint config files found in parent folders (which may be outside the Git working directory)

## 2.2.3
Fri, 30 Oct 2020 00:10:14 GMT

### Patches

- Update the "modern-module-resolution" patch to support ESLint 7.8.0 and newer

## 2.2.2
Wed, 28 Oct 2020 01:18:03 GMT

_Version update only_

## 2.2.1
Tue, 06 Oct 2020 00:24:06 GMT

_Version update only_

## 2.2.0
Mon, 05 Oct 2020 22:36:57 GMT

### Minor changes

- Add a mixin to support @rushstack/eslint-plugin-packlets

## 2.1.3
Wed, 30 Sep 2020 18:39:17 GMT

_Version update only_

## 2.1.2
Wed, 30 Sep 2020 06:53:53 GMT

### Patches

- Update README.md

## 2.1.1
Tue, 22 Sep 2020 05:45:56 GMT

### Patches

- Fix some missing files that were incorrectly excluded due to .npmignore

## 2.1.0
Tue, 22 Sep 2020 01:45:31 GMT

### Minor changes

- Relax the "typedef" rule so that type inference is now allowed for local variables, while still requiring explicit type declarations in other scopes

## 2.0.0
Tue, 22 Sep 2020 00:08:53 GMT

### Breaking changes

- (BREAKING CHANGE) The "@rushstack/eslint-config" entry point has been separated into 3 choices: "@rushstack/eslint-config/profile/node", "@rushstack/eslint-config/profile/node-trusted-tool", or "@rushstack/eslint-config/profile/web-app".  See the documentation for details.

## 1.4.2
Sat, 19 Sep 2020 04:37:26 GMT

_Version update only_

## 1.4.1
Sat, 19 Sep 2020 03:33:06 GMT

### Patches

- Add a dependency on the new @rushstack/eslint-plugin-security

## 1.4.0
Fri, 18 Sep 2020 22:57:24 GMT

### Minor changes

- Remove the @typescript-eslint/array-type rule
- Add *.spec.ts file extension for tests, since this is also a commonly used convention

### Patches

- Relax @typescript-eslint/no-use-before-define slightly

## 1.3.0
Thu, 27 Aug 2020 11:27:06 GMT

### Minor changes

- Enable the "@rushstack/hoist-jest-mock" lint rule to catch a common mistake when using Jest with Heft

### Patches

- Add an override to relax some lint rules for *.test.ts files, making unit tests easier to write

## 1.2.1
Mon, 24 Aug 2020 07:35:20 GMT

_Version update only_

## 1.2.0
Sat, 22 Aug 2020 05:55:42 GMT

### Minor changes

- Replace the "@rushstack/no-null" rule with a more flexible rule "@rushstack/no-new-null" (GitHub #2017)

## 1.1.0
Mon, 17 Aug 2020 04:53:23 GMT

### Minor changes

- Reclassify many lint rules to report ESLint warnings rather than errors

## 1.0.4
Wed, 12 Aug 2020 00:10:06 GMT

_Version update only_

## 1.0.3
Sat, 25 Jul 2020 01:38:03 GMT

### Patches

- Update README.md to add the missing file extension for .eslintrc.js

## 1.0.2
Thu, 25 Jun 2020 06:43:34 GMT

### Patches

- Enable variableDeclarationIgnoreFunction for the "@typescript-eslint/typedef" rule

## 1.0.1
Wed, 24 Jun 2020 09:50:48 GMT

### Patches

- Fix an issue with the published file set

## 1.0.0
Wed, 24 Jun 2020 09:04:28 GMT

### Breaking changes

- Upgrade to ESLint 7. Breaking change: patch-eslint6.js has been renamed to patch-eslint-resolver.js

## 0.5.8
Wed, 27 May 2020 05:15:10 GMT

### Patches

- Relax "max-lines" lint rule to 2,000 lines instead of 1,000 lines

## 0.5.7
Wed, 08 Apr 2020 04:07:33 GMT

### Patches

- Improve the error message text for the "ban-types" rule

## 0.5.6
Sat, 28 Mar 2020 00:37:16 GMT

### Patches

- Upgrade to eslint-plugin-tsdoc version 0.2.4

## 0.5.5
Wed, 18 Mar 2020 15:07:47 GMT

_Version update only_

## 0.5.4
Tue, 21 Jan 2020 21:56:13 GMT

### Patches

- Upgrade eslint-plugin-tsdoc to enable comments in tsdoc.json and more efficient loading

## 0.5.3
Sun, 19 Jan 2020 02:26:53 GMT

_Version update only_

## 0.5.2
Fri, 17 Jan 2020 01:08:23 GMT

_Version update only_

## 0.5.1
Thu, 09 Jan 2020 06:44:13 GMT

_Version update only_

## 0.5.0
Wed, 08 Jan 2020 00:11:31 GMT

### Minor changes

- Replace "no-restricted-syntax" rule with an equivalent rule "@rushstack/no-null"

## 0.4.2
Mon, 11 Nov 2019 16:07:56 GMT

### Patches

- Add eslint-plugin-tsdoc; update plugin versions

## 0.4.1
Tue, 22 Oct 2019 06:24:44 GMT

### Patches

- Update documentation

## 0.4.0
Tue, 15 Oct 2019 01:22:16 GMT

### Minor changes

- Rename `@microsoft/eslint-config-scalable-ts` to `@rushstack/eslint-config`

### Patches

- Upgraded ESLint plugin dependencies

## 0.3.1
Sun, 29 Sep 2019 23:56:29 GMT

### Patches

- Update repository URL

## 0.3.0
Wed, 04 Sep 2019 01:43:31 GMT

### Minor changes

- Fix an issue where the @typescript-eslint/array-type rule required a syntax that broke compatibility with TypeScript versions prior to 3.4

## 0.2.3
Tue, 03 Sep 2019 23:13:45 GMT

### Patches

- Upgrade to @typescript-eslint/eslint-plugin 2.1.0

## 0.2.2
Tue, 27 Aug 2019 01:48:45 GMT

### Patches

- Remove unused plugin reference

## 0.2.1
Tue, 27 Aug 2019 01:24:54 GMT

### Patches

- Replace "eslint-plugin-no-null" with a more lenient implementation that allows equality comparisons with "null"

## 0.2.0
Wed, 21 Aug 2019 21:56:59 GMT

### Minor changes

- Enable react/no-deprecated, react/no-unescaped-entities, and react/self-closing-comp

## 0.1.2
Fri, 16 Aug 2019 21:58:15 GMT

### Patches

- Relax peer dependency to allow usage with ESLint 5

## 0.1.1
Fri, 16 Aug 2019 01:15:03 GMT

### Patches

- Fix an issue where @typescript-eslint/no-unused-vars didn't work properly with React source files
- Relax @typescript-eslint/camelcase to allow "_checkBox1_onChanged"

## 0.1.0
Thu, 15 Aug 2019 02:56:10 GMT

### Minor changes

- Initial release

