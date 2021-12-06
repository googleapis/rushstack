'use strict';

const { SetPublicPathPlugin } = require('@rushstack/set-webpack-public-path-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function generateConfiguration(mode, outputFolderName) {
  return {
    mode: mode,
    entry: {
      'test-bundle': `${__dirname}/lib/index.js`
    },
    output: {
      path: `${__dirname}/${outputFolderName}`,
      filename: '[name]_[contenthash].js',
      chunkFilename: '[id].[name]_[contenthash].js'
    },
    plugins: [
      new SetPublicPathPlugin({
        scriptName: {
          useAssetName: true
        }
      }),
      new HtmlWebpackPlugin()
    ]
  };
}

module.exports = [
  generateConfiguration('development', 'dist-dev'),
  generateConfiguration('production', 'dist-prod')
];
