const path = require('path');
const getProjectConfig = require('./get-project-config');

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
 * @param {mixed} paths Paths to the current target directories
 * @returns
 */
const eslintResolver = (paths = null) => {
  paths = paths ?? getProjectConfig();
  const aliases = webpackAlias(paths.paths.src);
  const aliasMap = Object.entries(aliases);
  const pathsList = Array.from(new Set(Object.values(aliases))).map((item) => item + '/*');

  return {
    typescript: {
      alwaysTryTypes: true,
      project: paths?.paths?.project,
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
