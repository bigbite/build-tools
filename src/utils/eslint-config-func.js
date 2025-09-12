const eslintConfig = require('../../configs/eslint');

const { eslintResolver } = require('./get-alias');

/**
 * Allows for the ESLint Config to be used dynamically in code
 * with a passed config
 *
 * @param {Object} projectConfig The project config to add
 *
 * @return {Object} The full ESLint config with project settings
 */
module.exports = (projectConfig) => {
  return {
    ...eslintConfig,
    settings: {
      ...eslintConfig.settings,
      'import/resolver': eslintResolver(projectConfig),
    },
  };
};
