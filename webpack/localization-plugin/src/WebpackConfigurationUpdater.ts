// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import minimatch from 'minimatch';
import * as path from 'path';
import * as Webpack from 'webpack';
import * as SetPublicPathPluginPackageType from '@rushstack/set-webpack-public-path-plugin';
import { NewlineKind } from '@rushstack/node-core-library';
import * as lodash from 'lodash';

import { Constants } from './utilities/Constants';
import { LocalizationPlugin } from './LocalizationPlugin';
import { ILocLoaderOptions } from './loaders/LocLoader';
import { IBaseLoaderOptions } from './loaders/LoaderFactory';

export interface IWebpackConfigurationUpdaterOptions {
  pluginInstance: LocalizationPlugin;
  configuration: Webpack.Configuration;
  globsToIgnore: string[] | undefined;
  localeNameOrPlaceholder: string;
  resxNewlineNormalization: NewlineKind | undefined;
}

const FILE_TOKEN_REGEX: RegExp = new RegExp(lodash.escapeRegExp('[file]'));

export class WebpackConfigurationUpdater {
  public static amendWebpackConfigurationForMultiLocale(options: IWebpackConfigurationUpdaterOptions): void {
    const loader: string = path.resolve(__dirname, 'loaders', 'LocLoader.js');
    const loaderOptions: ILocLoaderOptions = {
      pluginInstance: options.pluginInstance,
      resxNewlineNormalization: options.resxNewlineNormalization
    };

    WebpackConfigurationUpdater._addLoadersForLocFiles(options, loader, loaderOptions);

    WebpackConfigurationUpdater._tryUpdateLocaleTokenInPublicPathPlugin(options);

    WebpackConfigurationUpdater._tryUpdateSourceMapFilename(options.configuration);
  }

  public static amendWebpackConfigurationForInPlaceLocFiles(
    options: IWebpackConfigurationUpdaterOptions
  ): void {
    const loader: string = path.resolve(__dirname, 'loaders', 'InPlaceLocFileLoader.js');
    const loaderOptions: IBaseLoaderOptions = {
      resxNewlineNormalization: options.resxNewlineNormalization
    };

    WebpackConfigurationUpdater._addRulesToConfiguration(options.configuration, [
      {
        test: Constants.RESX_OR_LOC_JSON_REGEX,
        use: [
          {
            loader: loader,
            options: loaderOptions
          }
        ],
        type: 'json',
        sideEffects: false
      }
    ]);
  }

  private static _tryUpdateLocaleTokenInPublicPathPlugin(options: IWebpackConfigurationUpdaterOptions): void {
    let setPublicPathPlugin: typeof SetPublicPathPluginPackageType.SetPublicPathPlugin | undefined;
    try {
      const pluginPackage: typeof SetPublicPathPluginPackageType = require('@rushstack/set-webpack-public-path-plugin');
      setPublicPathPlugin = pluginPackage.SetPublicPathPlugin;
    } catch (e) {
      // public path plugin isn't present - ignore
    }

    if (setPublicPathPlugin && options.configuration.plugins) {
      for (const plugin of options.configuration.plugins) {
        if (plugin instanceof setPublicPathPlugin) {
          if (
            plugin.options &&
            plugin.options.scriptName &&
            plugin.options.scriptName.isTokenized &&
            plugin.options.scriptName.name
          ) {
            plugin.options.scriptName.name = plugin.options.scriptName.name.replace(
              /\[locale\]/g,
              options.localeNameOrPlaceholder
            );
          }
        }
      }
    }
  }

  private static _addLoadersForLocFiles(
    options: IWebpackConfigurationUpdaterOptions,
    loader: string,
    loaderOptions: IBaseLoaderOptions
  ): void {
    const { globsToIgnore, configuration } = options;
    const rules: Webpack.RuleSetCondition =
      globsToIgnore && globsToIgnore.length > 0
        ? {
            include: Constants.RESX_OR_LOC_JSON_REGEX,
            exclude: (filePath: string): boolean =>
              globsToIgnore.some((glob: string): boolean => minimatch(filePath, glob))
          }
        : Constants.RESX_OR_LOC_JSON_REGEX;
    WebpackConfigurationUpdater._addRulesToConfiguration(configuration, [
      {
        test: rules,
        use: [
          {
            loader: loader,
            options: loaderOptions
          }
        ],
        type: 'json',
        sideEffects: false
      }
    ]);
  }

  private static _addRulesToConfiguration(
    configuration: Webpack.Configuration,
    rules: Webpack.RuleSetRule[]
  ): void {
    if (!configuration.module) {
      configuration.module = {
        rules: []
      };
    }

    if (!configuration.module.rules) {
      configuration.module.rules = [];
    }

    configuration.module.rules.push(...rules);
  }

  private static _tryUpdateSourceMapFilename(configuration: Webpack.Configuration): void {
    if (!configuration.output) {
      configuration.output = {}; // This should never happen
    }

    if (configuration.output.sourceMapFilename !== undefined) {
      configuration.output.sourceMapFilename = configuration.output.sourceMapFilename.replace(
        FILE_TOKEN_REGEX,
        Constants.NO_LOCALE_SOURCE_MAP_FILENAME_TOKEN
      );
    }
  }
}
