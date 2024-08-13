const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const wpScriptsConfig = require( '@wordpress/scripts/config/webpack.config' );

const Plugins = require('./plugins');
const Rules = require('./rules');
const entrypoints = require('../../utils/entrypoints');
const { webpackAlias } = require('./../../utils/get-alias');

// Define the bundled BrowserList config location/directory.
// eslint-disable-next-line no-undef
BROWSERSLIST_CONFIG = path.resolve(`${__dirname}/config`);

/**
 * Build the webpack configutation for the current project.
 *
 * @param {string} package.path The current directory path of the project.
 * @param {string} mode The build mode in which webpack is currently running (e.g. development or production).
 * @param {string} projectName The name of the project - this will be the director target.
 * @returns {object} The full webpack configuration for the current project.
 */
module.exports = (__PROJECT_CONFIG__, mode) => {
  const customWebpackConfigFile = __PROJECT_CONFIG__.paths.project + '/webpack.config.js';
  const customConfig = fs.existsSync(customWebpackConfigFile) ? require(customWebpackConfigFile) : null;

  let webpackConfig = {
    ...wpScriptsConfig,
    mode,
    entry: entrypoints(__PROJECT_CONFIG__.paths.src),
    resolve: {
      ...wpScriptsConfig.resolve,
      alias: webpackAlias(__PROJECT_CONFIG__.paths.src),
    },

    // resolve: {
    //   modules: [__PROJECT_CONFIG__.paths.node_modules, 'node_modules'],
    //   alias: webpackAlias(__PROJECT_CONFIG__.paths.src),
    //   extensions: ['.ts', '.tsx', '.js', '.jsx'],
    // },

    output: {
    //   // @TODO: This should be overridable at some point to allow for custom naming convention.
    //   filename: () => (mode === 'production' ? '[name]-[contenthash:8].js' : '[name].js'),
      ...wpScriptsConfig.output,
      path: path.resolve(`${__PROJECT_CONFIG__.paths.dist}`),
    },

    // watchOptions: {
    //   ignored: ['node_modules'],
    // },

    // performance: {
    //   assetFilter: (assetFilename) => /\.(js|css)$/.test(assetFilename),
    //   maxEntrypointSize: 20000000, // Large entry point size as we only need asset size. (2mb)
    //   maxAssetSize: 500000, // Set max size to 500kb.
    // },

    // devtool: mode === 'production' ? 'source-map' : 'inline-cheap-module-source-map',

    // externals: {
    //   moment: 'moment',
    //   lodash: ['lodash', 'lodash-es'],
    //   react: 'React',
    //   'react-dom': 'ReactDOM',
    //   jquery: 'jQuery',
    // },

    module: {
      ...wpScriptsConfig.module,
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

  const plugins = [
    // Global vars for checking dev environment.
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(mode === 'development'),
      __PROD__: JSON.stringify(mode === 'production'),
      __TEST__: JSON.stringify(process.env.NODE_ENV === 'test'),
    }),

    Plugins.DependencyExtraction(__PROJECT_CONFIG__, webpackConfig.externals),
    Plugins.ESLint(__PROJECT_CONFIG__),
    Plugins.MiniCssExtract(__PROJECT_CONFIG__),
    Plugins.StyleLint(__PROJECT_CONFIG__),
    Plugins.Clean(__PROJECT_CONFIG__),
    Plugins.Copy(__PROJECT_CONFIG__),
    Plugins.TemplateGenerator(__PROJECT_CONFIG__),
    Plugins.AssetMessage(__PROJECT_CONFIG__),
  ];

  // webpackConfig.plugins = plugins;

  console.log(webpackConfig);

  return webpackConfig;
};
