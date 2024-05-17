const defaultConfig = require('@wordpress/prettier-config');

const prettierConfig = {
  ...defaultConfig,
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  trailingComma: 'all',
  arrowParens: 'always',
  singleQuote: true,
  endOfLine: 'auto',
};

module.exports = prettierConfig;
