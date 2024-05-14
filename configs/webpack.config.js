const path = require('path');
const webpack = require('webpack');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const eslintConfig = require('./eslint.js');
const styleLintConfig = require('./stylelint.js');

/** @type {webpack.Configuration} */
const webpackConfig = {
  ...defaultConfig,
  plugins: [
    ...defaultConfig.plugins,
    new ESLintWebpackPlugin({
      baseConfig: eslintConfig,
    }),
    new StyleLintPlugin({
      config: styleLintConfig,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `static/**/*`,
          context: 'src',
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  resolve: {
    ...defaultConfig.resolve,
    alias: {
      ...defaultConfig.resolve.alias,
      '@Components': path.resolve(process.cwd(), 'src/components'),
      Components: path.resolve(process.cwd(), 'src/components'),
      '@Static': path.resolve(process.cwd(), 'src/static'),
      Static: path.resolve(process.cwd(), 'src/static'),
      '@Utils': path.resolve(process.cwd(), 'src/utils'),
      Utils: path.resolve(process.cwd(), 'src/utils'),
    },
  },
};

module.exports = webpackConfig;
