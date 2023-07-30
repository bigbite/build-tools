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
    '@Static': path.resolve(src, 'static'),
    Static: path.resolve(src, 'static'),
    '@Utils': path.resolve(src, 'utils'),
    Utils: path.resolve(src, 'utils'),
  };
};

/**
 * Get and map aliases to the eslint resolver structure.
 *
 * @param {string} src Path to the current target src directory
 * @returns
 */
const eslintResolver = ({ src, project }) => {
  const aliases = webpackAlias(src);
  const aliasMap = Object.entries(aliases);
  const pathsList = Array.from(new Set(Object.values(aliases) + '/*'));

  return {
    typescript: {
      alwaysTryTypes: true,
      project,
    },
    alias: {
      map: aliasMap,
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
    },
    node: {
      paths: pathsList,
    },
  }
};

module.exports = {
  webpackAlias,
  eslintResolver,
};
