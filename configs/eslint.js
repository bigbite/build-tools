const { eslintResolver } = require('./../src/utils/get-alias');

module.exports = {
  extends: [
    'plugin:@wordpress/eslint-plugin/recommended-with-formatting', // no prettier, using the version with prettier in the plugin will cause a conflict
    'plugin:prettier/recommended', // uses our prettier config
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  settings: {
    'import/resolver': eslintResolver(),
  },
  rules: {
    'jsdoc/require-returns-description': 0, // we don't always need a description
    '@wordpress/i18n-text-domain': 0, // we prefer to always set the text domain, including when using 'default'
    'react-hooks/exhaustive-deps': 'error', // increase wp-scripts rule to from warn to error
    complexity: ['error', 10],
  },
};
