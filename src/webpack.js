const fs = require('fs');
const path = require('path');

const webpack = require('webpack');

const Plugins = require('./plugins');
const Rules = require('./rules');
const entrypoints = require('./utils/entrypoints');

// Define the bundled BrowserList config location/directory.
BROWSERSLIST_CONFIG = path.resolve(`${__dirname}/config`);

/**
 * Build the webpack configutation for the current project. 
 * 
 * @param {string} projectPath The current directory path of the project.
 * @param {string} mode The build mode in which webpack is currently running (e.g. development or production).
 * @param {string} projectName The name of the project - this will be the director target.
 * @returns {object} The full webpack configuration for the current project.
 */
module.exports = (projectPath, mode, projectName) => {
  let assetsProjectName = projectName;
  
  try {
    const packagePath = `${projectPath}/package.json`;
    
    if(!fs.existsSync(packagePath)) {
      throw new Error(`package.json does not exist for ${projectName} project.\n\nPlease create one in: ${projectPath}`);
    }

    const packageJSON = require(packagePath);
    const packageNames = packageJSON.name.split('/');
    assetsProjectName = packageNames[packageNames.length - 1];
  } catch(e) {
    throw e.message;
  }

  /**
   * Project config holds all information about a particular project,
   * rather than directly pulling out paths from files or attempting
   * to build them, use what is here.
   */
  __PROJECT_CONFIG__ = {
    name: assetsProjectName,
    paths: {
      project: path.resolve(projectPath),
      config: path.resolve(`${__dirname}/configs`),
      src: path.resolve(`${projectPath}/src`),
      dist: path.resolve(`${projectPath}/dist`),
      clean: [`${projectPath}/dist/scripts/**/*`, `${projectPath}/dist/styles/**/*`],
    },
    clean: true,
    copy: true,
    mode,
  };

  console.log('compiling: ', __PROJECT_CONFIG__.name);

  return {
    entry: entrypoints(__PROJECT_CONFIG__.paths.src),

    output: {
      // @TODO: This should be overridable at some point to allow for custom naming convention.
      filename: () => {
        return mode === 'production' ? '[name]-[contenthash:8].js' : '[name].js';
      },
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

      Plugins.ESLint(__PROJECT_CONFIG__),
      Plugins.HTMLWebpack(__PROJECT_CONFIG__),
      Plugins.MiniCssExtract(__PROJECT_CONFIG__),
      Plugins.StyleLint(__PROJECT_CONFIG__),
      Plugins.Clean(__PROJECT_CONFIG__),
      Plugins.Copy(__PROJECT_CONFIG__),
    ],

    module: {
      rules: [
        Rules.javascript(__PROJECT_CONFIG__),
        ...Rules.images(__PROJECT_CONFIG__),
        Rules.styles(__PROJECT_CONFIG__),
      ],
    },
  };
};
