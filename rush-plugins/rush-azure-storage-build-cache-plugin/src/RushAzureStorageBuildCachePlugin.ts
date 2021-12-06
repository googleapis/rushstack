// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { Import } from '@rushstack/node-core-library';
import type { IRushPlugin, RushSession, RushConfiguration } from '@rushstack/rush-sdk';
import type { AzureEnvironmentNames } from './AzureStorageBuildCacheProvider';

const AzureStorageBuildCacheProviderModule: typeof import('./AzureStorageBuildCacheProvider') = Import.lazy(
  './AzureStorageBuildCacheProvider',
  require
);

const PLUGIN_NAME: string = 'AzureStorageBuildCachePlugin';

/**
 * @public
 */
interface IAzureBlobStorageConfigurationJson {
  /**
   * The name of the the Azure storage account to use for build cache.
   */
  storageAccountName: string;

  /**
   * The name of the container in the Azure storage account to use for build cache.
   */
  storageContainerName: string;

  /**
   * The Azure environment the storage account exists in. Defaults to AzureCloud.
   */
  azureEnvironment?: AzureEnvironmentNames;

  /**
   * An optional prefix for cache item blob names.
   */
  blobPrefix?: string;

  /**
   * If set to true, allow writing to the cache. Defaults to false.
   */
  isCacheWriteAllowed?: boolean;
}

/**
 * @public
 */
export class RushAzureStorageBuildCachePlugin implements IRushPlugin {
  public pluginName: string = PLUGIN_NAME;

  public apply(rushSession: RushSession, rushConfig: RushConfiguration): void {
    rushSession.hooks.initialize.tap(PLUGIN_NAME, () => {
      rushSession.registerCloudBuildCacheProviderFactory('azure-blob-storage', (buildCacheConfig) => {
        type IBuildCache = typeof buildCacheConfig & {
          azureBlobStorageConfiguration: IAzureBlobStorageConfigurationJson;
        };
        const { azureBlobStorageConfiguration } = buildCacheConfig as IBuildCache;
        return new AzureStorageBuildCacheProviderModule.AzureStorageBuildCacheProvider({
          storageAccountName: azureBlobStorageConfiguration.storageAccountName,
          storageContainerName: azureBlobStorageConfiguration.storageContainerName,
          azureEnvironment: azureBlobStorageConfiguration.azureEnvironment,
          blobPrefix: azureBlobStorageConfiguration.blobPrefix,
          isCacheWriteAllowed: !!azureBlobStorageConfiguration.isCacheWriteAllowed
        });
      });
    });
  }
}
