const ESLintPlugin = require('eslint-webpack-plugin');
const ESLintConfig = require('../../../../configs/eslint');
/**
 * Sets the config for the ESLint webpack plugin.
 * @returns ESLintPlugin instance.
 */
module.exports = () =>
  new ESLintPlugin({
    baseConfig: ESLintConfig,
  });
