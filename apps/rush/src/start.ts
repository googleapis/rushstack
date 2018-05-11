// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as colors from 'colors';
import * as os from 'os';
import * as semver from 'semver';

const nodeVersion: string = process.versions.node;

// tslint:disable-next-line

// We are on an ancient version of NodeJS that is known not to work with Rush
if (semver.satisfies(nodeVersion, '<= 6.4.0')) {
  console.error(colors.red(`Your version of Node.js (${nodeVersion}) is very old and incompatible with Rush.`
    + ` Please upgrade to the latest Long-Term Support (LTS) version.`));
  process.exit(1);
}

// We are on a much newer release than we have tested and support
// tslint:disable-next-line
else if (semver.satisfies(nodeVersion, '>=9.0.0')) {
  console.warn(colors.yellow(`Your version of Node.js (${nodeVersion}) has not been tested with this release of Rush.`
    + ` The Rush team will not accept issue reports for it.`
    + ` Please consider upgrading Rush or downgrading Node.js.`));
}

// We are not on an LTS release
// tslint:disable-next-line
else if (!semver.satisfies(nodeVersion, '^6.9.0')
      && !semver.satisfies(nodeVersion, '^8.9.0')) {
  console.warn(colors.yellow(`Your version of Node.js (${nodeVersion}) is not a Long-Term Support (LTS) release.`
    + ` These versions frequently contain bugs, and the Rush team will not accept issue reports for them.`
    + ` Please consider installing a stable release.`));
}

import * as path from 'path';
import { JsonFile, IPackageJson } from '@microsoft/node-core-library';

import { Rush, EnvironmentVariableNames } from '@microsoft/rush-lib';
import { Utilities } from '@microsoft/rush-lib/lib/utilities/Utilities';

import { MinimalRushConfiguration } from './MinimalRushConfiguration';
import { RushVersionSelector } from './RushVersionSelector';

// Load the configuration
const configuration: MinimalRushConfiguration | undefined = MinimalRushConfiguration.loadFromDefaultLocation();
const currentPackageJson: IPackageJson = JsonFile.load(path.join(__dirname, '..', 'package.json'));

let rushVersionToLoad: string | undefined = undefined;

const previewVersion: string | undefined = process.env[EnvironmentVariableNames.RUSH_PREVIEW_VERSION];
let usingPreviewVersion: boolean = false;

if (previewVersion && semver.valid(previewVersion, false)) {
  rushVersionToLoad = previewVersion;
  usingPreviewVersion = true;
} else if (configuration) {
  rushVersionToLoad = configuration.rushVersion;
}

if (usingPreviewVersion) {
  console.error(colors.yellow(
    os.EOL + os.EOL +
    '* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *' + os.EOL +
    '  WARNING! THE "RUSH_PREVIEW_VERSION" ENVIRONMENT VARIABLE IS SET.' + os.EOL +
    '  You are previewing version 1.2.3 of Rush as an experiment.' + os.EOL +
    '  The rush.json configuration for this repo requests version 3.2.1.' + os.EOL +
    '  To restore the normal behavior, unset the RUSH_PREVIEW_VERSION' + os.EOL +
    '  environment variable.' + os.EOL +
    '* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *' +
    os.EOL + os.EOL
  ));
}

// If we're inside a repo folder, and it's requesting a different version, then use the RushVersionManager to
// install it
if (rushVersionToLoad && rushVersionToLoad !== currentPackageJson.version) {
  const versionSelector: RushVersionSelector = new RushVersionSelector(
    currentPackageJson.version
  );
  versionSelector.ensureRushVersionInstalled(rushVersionToLoad)
    .catch((error: Error) => {
      console.log(colors.red('Error: ' + error.message));
    });
} else {
  // Otherwise invoke the rush-lib that came with this rush package

  // Rush is "managed" if its version and configuration are dictated by a repo's rush.json
  const isManaged: boolean = !!configuration;

  Rush.launch(currentPackageJson.version, isManaged);
}
