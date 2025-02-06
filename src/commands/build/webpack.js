const fs = require('fs');
const path = require('path');
const { cloneDeep } = require('lodash');
const wpScriptsConfig = require('@wordpress/scripts/config/webpack.config');

const Rules = require('./rules');
const entrypoints = require('../../utils/entrypoints');
const { webpackAlias } = require('./../../utils/get-alias');
const { containsBlockFiles } = require('./../../utils/projectpaths');

// Define the bundled BrowserList config location/directory.
// eslint-disable-next-line no-undef
BROWSERSLIST_CONFIG = path.resolve(`${__dirname}/config`);

/**
 * Build the webpack configuration for the current project.
 *
 * @param {string} package.path The current directory path of the project.
 * @param {string} mode The build mode in which webpack is currently running (e.g. development or production).
 * @param {string} projectName The name of the project - this will be the director target.
 * @returns {object} The full webpack configuration for the current project.
 */
module.exports = (__PROJECT_CONFIG__, mode) => {
  const customWebpackConfigFile = __PROJECT_CONFIG__.paths.project + '/webpack.config.js';
  const customConfig = fs.existsSync(customWebpackConfigFile)
    ? require(customWebpackConfigFile)
    : null;

  const wpConfig = cloneDeep(wpScriptsConfig);

  let webpackConfig = {
    ...wpConfig,
    mode,
    resolve: {
      ...wpConfig.resolve,
      alias: webpackAlias(__PROJECT_CONFIG__.paths.src),
    },

    output: {
      ...wpConfig.output,
      path: path.resolve(`${__PROJECT_CONFIG__.paths.dist}`),
    },

    module: {
      ...wpConfig.module,
      rules: [
        ...wpConfig.module.rules,
        ...Rules.typescript(__PROJECT_CONFIG__),
        ...Rules.javascript(__PROJECT_CONFIG__),
        ...Rules.images(__PROJECT_CONFIG__),
        ...Rules.styles(__PROJECT_CONFIG__),
      ],
    },
    entry: () => {
      let projectEntrypoints = {};
      try {
        projectEntrypoints = entrypoints(
          __PROJECT_CONFIG__.paths.src,
          __PROJECT_CONFIG__.filteredEntrypoints,
        );
      } catch (error) {
        // don't do anything if entrypoints are not found
      }

      if (!containsBlockFiles(__PROJECT_CONFIG__.paths.project)) {
        return projectEntrypoints;
      }

      process.env.WP_SRC_DIRECTORY = __PROJECT_CONFIG__.paths.dir + '/src';

      return {
        ...wpConfig.entry(),
        ...projectEntrypoints,
      };
    },
  };

  if (customConfig) {
    const shouldExtend = customConfig?.extends ?? true;
    if (!shouldExtend) {
      webpackConfig = customConfig;
    } else {
      webpackConfig = {
        ...webpackConfig,
        ...customConfig,
      };
    }

    delete webpackConfig.extends;
  }

  return webpackConfig;
};
