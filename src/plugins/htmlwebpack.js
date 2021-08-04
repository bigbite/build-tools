const HtmlWebpackPlugin = require('html-webpack-plugin');
const assetSettingsTemplate = require('../templates/asset-settings');

module.exports = ({ mode, paths, name }) => {
  return new HtmlWebpackPlugin({
    excludeChunks: ['static'],
    filename: `${paths.project}/inc/asset-settings.php`,
    inject: false,
    minify: false,
    templateContent: (config) => assetSettingsTemplate(config, name, mode),
  });
};
