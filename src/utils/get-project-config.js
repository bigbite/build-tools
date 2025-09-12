const path = require('path');

/**
 * Project config holds all information about a particular project,
 * rather than directly pulling out paths from files or attempting
 * to build them, use what is here.
 *
 * @param {Object} packageObject       The package object retrieved from getPackage
 * @param {string} packageObject.name  The name of the project
 * @param {Object} packageObject.json  The contents of the package.json file
 * @param {string} packageObject.path  The directory path of the project
 * @param {string} mode                The mode the project is being built in - development or production
 * @param {Array}  filteredEntrypoints An array of entrypoints to filter the build by
 *
 * @return {Object} The full project config object
 */
module.exports = (
  packageObject = {
    name: '',
    json: {
      version: 'v0.0.0',
    },
    path: './',
  },
  mode = 'development',
  filteredEntrypoints = [],
) => {
  return {
    name: packageObject?.name ?? '',
    version: packageObject?.json?.version ?? 'v0.0.0',
    paths: {
      dir: path.resolve(packageObject.path).replace(process.cwd(), ''),
      project: path.resolve(packageObject.path),
      config: path.resolve(`${__dirname}/../../configs`),
      src: path.resolve(`${packageObject.path}/src`),
      build: path.resolve(`${packageObject.path}/build`),
      clean: [
        path.resolve(`${packageObject.path}/build/scripts`),
        path.resolve(`${packageObject.path}/build/styles`),
        path.resolve(`${packageObject.path}/build/static`),
      ],
      node_modules: path.resolve(packageObject.path, 'node_modules'),
    },
    clean: true,
    copy: true,
    mode,
    filteredEntrypoints,
  };
};
