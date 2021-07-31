const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const assetSettingsTemplate = require('./templates/asset-settings.js');

module.exports = (PROJECT_PATH, mode, projectName) => {
  const SRC_PATH = `${PROJECT_PATH}/src`;

  const USE_PLUGIN = {
    CLEAN: mode === 'production',
    COPY: true,
  };

  const PATHS_TO_CLEAN = [
    `${PROJECT_PATH}/dist/scripts/**/*`,
    `${PROJECT_PATH}/dist/styles/**/*`,
  ];

  return [
    // new webpack.ExtendedAPIPlugin(),

    // Sets mode so we can access it in `postcss.config.js`.
    new webpack.LoaderOptionsPlugin({
      options: { mode },
    }),

    new HtmlWebpackPlugin({
      excludeChunks: ['static'],
      filename: `${PROJECT_PATH}/inc/asset-settings.php`,
      inject: false,
      minify: false,
      templateContent: (config) =>
        assetSettingsTemplate(config, projectName, mode),
    }),

    // Extract CSS to own bundle, filename relative to output.path.
    new MiniCssExtractPlugin({
      filename:
        // or ../styles/[name].css for dynamic name
        mode === 'production'
          ? '../styles/[name]-[contenthash:8].css'
          : '../styles/[name].css',
      chunkFilename: '[name].css',
    }),

    // Lint SCSS.
    new StyleLintPlugin({
      syntax: 'scss',
      context: SRC_PATH,
    }),

    // Global vars for checking dev environment.
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(mode === 'development'),
      __PROD__: JSON.stringify(mode === 'production'),
      __TEST__: JSON.stringify(process.env.NODE_ENV === 'test'),
    }),

    new webpack.BannerPlugin(`&`),

    USE_PLUGIN.CLEAN &&
      new CleanWebpackPlugin({
        verbose: true,
        cleanOnceBeforeBuildPatterns: PATHS_TO_CLEAN,
        dangerouslyAllowCleanPatternsOutsideProject: true,
        dry: false,
      }),

    USE_PLUGIN.COPY &&
      new CopyWebpackPlugin({
        patterns: [
          {
            from: `${SRC_PATH}/static/**/*`,
            to: `${PROJECT_PATH}/dist/`,
            context: SRC_PATH,
            noErrorOnMissing: true,
          },
        ],
      }),
  ].filter(Boolean);
};
