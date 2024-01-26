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
      parserOptions: {
        ...eslintConfig.parserOptions,
        settings: {
          ...eslintConfig.parserOptions.settings,
          'import/resolver': eslintResolver(projectConfig),
        }
      }
    }
};