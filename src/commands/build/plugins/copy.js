const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = ({ copy, paths }) =>
  copy &&
  new CopyWebpackPlugin({
    patterns: [
      {
        from: `${paths.src}/static/**/*`,
        to: paths.dist,
        context: paths.src,
        noErrorOnMissing: true,
      },
    ],
  });
