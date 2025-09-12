const postcssConfig = require('../../../../configs/postcss');

/**
 * Compiles rules and presets for styles
 *
 * @param {Object} config      The project configuration object
 * @param {string} config.mode The current build mode
 *
 * @return {Object} Rules and presets for styles
 */
module.exports = ({ mode }) => [
  {
    test: /\.(sa|sc|c)ss$/,
    use: [
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
