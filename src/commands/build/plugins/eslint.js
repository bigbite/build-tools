const ESLintPlugin = require('eslint-webpack-plugin');
const ESLintConfigFunc = require('./../../../utils/eslint-config-func');

/**
 * Sets the config for the ESLint webpack plugin.
 * @returns ESLintPlugin instance.
 */
module.exports = (projectConfig) =>
  new ESLintPlugin({
    baseConfig: ESLintConfigFunc(projectConfig),
  });
