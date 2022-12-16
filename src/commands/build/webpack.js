const path = require('path');
const webpack = require('webpack');

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
module.exports = (__PROJECT_CONFIG__, mode) => ({
  mode,
  entry: entrypoints(__PROJECT_CONFIG__.paths.src),

  resolve: {
    modules: [__PROJECT_CONFIG__.paths.node_modules, 'node_modules'],
    alias: webpackAlias(__PROJECT_CONFIG__.paths.src),
  },

  output: {
    // @TODO: This should be overridable at some point to allow for custom naming convention.
    filename: () => (mode === 'production' ? '[name]-[contenthash:8].js' : '[name].js'),
    path: path.resolve(`${__PROJECT_CONFIG__.paths.dist}/scripts`),
  },

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    jquery: 'jQuery',
  },

  watchOptions: {
    ignored: ['node_modules'],
  },

  performance: {
    assetFilter: (assetFilename) => /\.(js|css)$/.test(assetFilename),
    maxEntrypointSize: 20000000, // Large entry point size as we only need asset size. (2mb)
    maxAssetSize: 500000, // Set max size to 500kb.
  },

  devtool: mode === 'production' ? 'source-map' : 'inline-cheap-module-source-map',

  plugins: [
    // Global vars for checking dev environment.
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(mode === 'development'),
      __PROD__: JSON.stringify(mode === 'production'),
      __TEST__: JSON.stringify(process.env.NODE_ENV === 'test'),
    }),

    Plugins.DependencyExtraction(__PROJECT_CONFIG__),
    Plugins.ESLint(__PROJECT_CONFIG__),
    Plugins.MiniCssExtract(__PROJECT_CONFIG__),
    Plugins.StyleLint(__PROJECT_CONFIG__),
    Plugins.Clean(__PROJECT_CONFIG__),
    Plugins.Copy(__PROJECT_CONFIG__),
    Plugins.TemplateGenerator(__PROJECT_CONFIG__),
  ],

  module: {
    rules: [
      ...Rules.javascript(__PROJECT_CONFIG__),
      ...Rules.images(__PROJECT_CONFIG__),
      ...Rules.styles(__PROJECT_CONFIG__),
    ],
  },
});
