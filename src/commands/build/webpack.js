// @wordpress/script global defaults.
process.env.WP_EXPERIMENTAL_MODULES = true;
process.env.WP_COPY_PHP_FILES_TO_DIST = true;
process.env.WP_SOURCE_PATH = '/src';

const fs = require('fs');
const path = require('path');
const { cloneDeep } = require('lodash');
const [
  wpScriptsConfig,
  wpScriptsModulesConfig,
] = require('@wordpress/scripts/config/webpack.config');

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
  process.env.WP_SOURCE_PATH = __PROJECT_CONFIG__.paths.dir + '/src';
  
  const customWebpackConfigFile = __PROJECT_CONFIG__.paths.project + '/webpack.config.js';
  const customConfig = fs.existsSync(customWebpackConfigFile)
    ? require(customWebpackConfigFile)
    : null;

  const wpConfig = cloneDeep(wpScriptsConfig);
    
  // @TODO: There's a possibility this can be moved to a plugin.
  // Using compiler or compilation hooks may resolve the need to
  // inject here as this context is taken directly from the
  // WP_SRC_DIRECTORY node environment variable in node.
  // Usage can be found in the following places:
  // - https://github.com/WordPress/gutenberg/blob/abe37675d4e25f35828e780c49588e01d26f4e31/packages/scripts/scripts/start.js#L33
  // - https://github.com/WordPress/gutenberg/blob/abe37675d4e25f35828e780c49588e01d26f4e31/packages/scripts/utils/config.js#L184
  // This environment variable will be need to be set for each build
  // run.
  // Alternatively, more flexible solution can be used where we're
  // with less predefined array indices.
  for(let i in wpConfig.plugins) {
    let { constructor } = wpConfig.plugins[i];

    switch(constructor.name) {
      case 'CopyPlugin':
        wpConfig.plugins[i].patterns = wpConfig.plugins[i].patterns.map(pattern => ({
          ...pattern,
          context: __PROJECT_CONFIG__.paths.src,
        }));
        break;
      case 'PhpFilePathsPlugin':
        wpConfig.plugins[i].options = {
          ...wpConfig.plugins[i].options,
          context: __PROJECT_CONFIG__.paths.src,
        };
        break;
    }
  }

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

      return {
        ...wpConfig.entry(),
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
