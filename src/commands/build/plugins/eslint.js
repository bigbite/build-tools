const ESLintPlugin = require('eslint-webpack-plugin');
const ESLintConfig = require('../../../../configs/eslint');
/**
 * Sets the config for the ESLint webpack plugin.
 * @returns ESLintPlugin instance.
 */
module.exports = (projectConfig) =>
  new ESLintPlugin({
    baseConfig: ESLintConfig(projectConfig),
  });
