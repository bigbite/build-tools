/**
 * Compiles rules and presets for Images.
 * @param {object} config The project configuration object.
 * @returns {object} Rules and presets for images.
 */
module.exports = ({ paths }) => [
  {
    test: /\.(png|woff|woff2|eot|ttf|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader',
    issuer: /\.(css|scss)?$/,
    options: {
      name: '[path][name].[ext]',
      emitFile: false, // Don't emit, using copy function to copy files over.
      outputPath: '../', // or // publicPath: '../'.
      context: paths.src,
    },
  },
  {
    test: /\.svg$/,
    issuer: /\.js?$/,
    use: [
      'babel-loader',
      'url-loader',
      {
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            removeViewBox: false,
          },
        },
      },
    ],
  },
];
