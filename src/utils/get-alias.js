const path = require('path');

/**
 * Get a list of aliases structured for webpack.
 *
 * @param {string} src Path to the current target src directory
 * @returns
 */
const webpackAlias = (src) => {
  return {
    '@Components': path.resolve(src, 'components'),
    Components: path.resolve(src, 'components'),
  };
};

/**
 * Get and map aliases to the eslint resolver structure.
 *
 * @param {string} src Path to the current target src directory
 * @returns
 */
const eslintResolver = (src) => {
  const aliases = webpackAlias(src);
  const aliasMap = Object.entries(aliases);
  const pathsList = Array.from(new Set(Object.values(aliases)));

  return {
    alias: {
      map: aliasMap,
      extensions: ['.mjs', '.js'],
    },
    node: {
      paths: pathsList,
    },
  };
};

module.exports = {
  webpackAlias,
  eslintResolver,
};
