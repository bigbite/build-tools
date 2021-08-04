const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const getEntryPoints = require('./utils/getEntryPoints.js');
const postcssConfig = require('./postcss.config.js');
const plugins = require('./plugins.js');

const compileProjects = (PROJECT_PATH, mode, projectName) => {
  const SRC_PATH = `${PROJECT_PATH}/src`;
  PROJECT_PATH = PROJECT_PATH !== '.' ? PROJECT_PATH : path.resolve('./');

  const fileLoaderOptions = {
    name: '[path][name].[ext]',
    emitFile: false, // Don't emit, using copy function to copy files over.
    outputPath: '../', // or // publicPath: '../'.
    context: SRC_PATH,
  };

  return {
    entry: getEntryPoints(SRC_PATH),

    output: {
      filename: mode === 'production' ? '[name]-[fullhash:8].js' : '[name].js',
      path: `${PROJECT_PATH}/dist/scripts`,
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

    devtool:
      mode === 'production' ? 'source-map' : 'inline-cheap-module-source-map',

    stats: {
      builtAt: true,
      entrypoints: false,
      modules: false,
      children: false,
      excludeAssets: 'static', // Hide the copied static files from the output:
    },

    plugins: plugins(PROJECT_PATH, mode, projectName),

    module: {
      rules: [
        {
          exclude: [/node_modules\/(?!(swiper|dom7)\/).*/, /\.test\.jsx?$/],
          use: [{ loader: 'babel-loader' }],
        },

        {
          test: /\.(png|woff|woff2|eot|ttf|gif|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader',
          options: fileLoaderOptions,
        },

        {
          test: /\.svg$/,
          use: 'svg-sprite-loader',
        },

        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                postcssOptions: postcssConfig(mode),
              },
            },
            {
              loader: 'resolve-url-loader',
              options: {
                debug: false,
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        },

        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader', 'eslint-loader'],
        },
      ],
    },
  };
};

module.exports = compileProjects;
