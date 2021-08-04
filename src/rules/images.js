/**
 * Compiles rules and presets for Images.
 * @param {object} config The project configuration object.
 * @returns {object} Rules and presets for images.
 */
module.exports = ({ paths }) => {
  return [
    {
      test: /\.(png|woff|woff2|eot|ttf|gif|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]',
        emitFile: false, // Don't emit, using copy function to copy files over.
        outputPath: '../', // or // publicPath: '../'.
        context: paths.src,
      },
    },
    {
      test: /\.svg$/,
      use: 'svg-sprite-loader',
    },
  ];
};
