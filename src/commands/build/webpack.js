// @wordpress/script global defaults.
process.env.WP_EXPERIMENTAL_MODULES = true;
process.env.WP_COPY_PHP_FILES_TO_DIST = true;

const fs = require('fs');
const path = require('path');
const { cloneDeep } = require('lodash');
const eslintPlugin = require('./plugins/eslint');
const stylelintPlugin = require('./plugins/stylelint');
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
const scriptsConfig = (__PROJECT_CONFIG__, mode) => {
  // This is needed to ensure that code resolved in the wp scripts
  // webpack config utilises the correct source path for each project.
  const configPath = '@wordpress/scripts/config/webpack.config';
  delete require.cache[require.resolve(configPath)];
  process.env.WP_SOURCE_PATH = '.' + __PROJECT_CONFIG__.paths.dir + '/src';

  const [wpScriptsConfig] = require(configPath);
  const wpConfig = cloneDeep(wpScriptsConfig);
  const wpScriptsEntrypoints = wpConfig.entry();

  const customWebpackConfigFile = __PROJECT_CONFIG__.paths.project + '/webpack.config.js';
  const customConfig = fs.existsSync(customWebpackConfigFile)
    ? require(customWebpackConfigFile)
    : null;

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
      rules: [...wpConfig.module.rules, ...Rules.styles(__PROJECT_CONFIG__)],
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

      return {
        ...wpScriptsEntrypoints,
        ...projectEntrypoints,
      };
    },

    plugins: [
      ...wpConfig.plugins,
      eslintPlugin(__PROJECT_CONFIG__),
      stylelintPlugin(__PROJECT_CONFIG__),
    ],
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

const modulesConfig = (__PROJECT_CONFIG__, mode) => {
  const [wpScriptsModulesConfig] = require('@wordpress/scripts/config/webpack.config');

  const wpConfig = cloneDeep(wpScriptsModulesConfig);

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
  };

  return webpackConfig;
};

module.exports = {
  scriptsConfig,
  modulesConfig,
};
