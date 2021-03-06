const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssConfig = require('../../../../configs/postcss');

/**
 * Compiles rules and presets for styles.
 * @param {object} config The project configuration object.
 * @returns {object} Rules and presets for styles.
 */
module.exports = ({ mode }) => [
  {
    test: /\.(sa|sc|c)ss$/,
    use: [
      // Seperate CSS included in JS.
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          url: false,
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
];
