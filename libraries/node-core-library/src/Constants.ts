// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

/**
 * String constants for common filenames and parts of filenames.
 *
 * @public
 */
export enum FileConstants {
  /**
   * "package.json" - the configuration file that defines an NPM package
   */
  PackageJson = 'package.json'
}

/**
 * String constants for common folder names.
 *
 * @public
 */
export enum FolderConstants {
  /**
   * ".git" - the data storage for a Git working folder
   */
  Git = '.git',

  /**
   * "node_modules" - the folder where package managers install their files
   */
  NodeModules = 'node_modules'
}
