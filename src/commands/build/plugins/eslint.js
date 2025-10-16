const ESLintPlugin = require('eslint-webpack-plugin');

const ESLintConfigFunc = require('./../../../utils/eslint-config-func');

/**
 * Sets the config for the ESLint webpack plugin
 *
 * @param {Object} projectConfig Project config object
 *
 * @return {ESLintPlugin} ESLintPlugin instance
 */
module.exports = (projectConfig) =>
  new ESLintPlugin({
    baseConfig: ESLintConfigFunc(projectConfig),
  });
