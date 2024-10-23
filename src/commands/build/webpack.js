const fs = require('fs');
const path = require('path');
const { cloneDeep } = require('lodash');
const wpScriptsConfig = require( '@wordpress/scripts/config/webpack.config' );

const Rules = require('./rules');
const entrypoints = require('../../utils/entrypoints');
const { webpackAlias } = require('./../../utils/get-alias');

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
  const customConfig = fs.existsSync(customWebpackConfigFile) ? require(customWebpackConfigFile) : null;

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
  wpConfig.plugins[3].patterns[0].context = __PROJECT_CONFIG__.paths.src;
  wpConfig.plugins[3].patterns[1].context = __PROJECT_CONFIG__.paths.src;

  let webpackConfig = {
    ...wpConfig,
    mode,
    entry: entrypoints(__PROJECT_CONFIG__.paths.src),
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
        ...Rules.typescript(__PROJECT_CONFIG__),
        ...Rules.javascript(__PROJECT_CONFIG__),
        ...Rules.images(__PROJECT_CONFIG__),
        ...Rules.styles(__PROJECT_CONFIG__),
      ],
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
