const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Extract CSS to own bundle, filename relative to output.path.
module.exports = ({ mode }) =>
  new MiniCssExtractPlugin({
    filename: () =>
      mode === 'production' ? '../styles/[name]-[contenthash:8].css' : '../styles/[name].css',
    chunkFilename: '[name].css',
  });
