const eslintConfig = require('../../configs/eslint');
const { eslintResolver } = require('./get-alias');

/**
 * Allows for the ESLint Config to be used dynamically in code
 * with a passed config.
 * @param {object} projectConfig The project config to add
 * @returns
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
