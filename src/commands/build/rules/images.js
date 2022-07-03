/**
 * Compiles rules and presets for Images.
 * @param {object} config The project configuration object.
 * @returns {object} Rules and presets for images.
 */
module.exports = ({ paths }) => [
  {
    test: /\.(png|woff|woff2|eot|ttf|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader',
    issuer: /\.(css|scss|js)?$/,
    options: {
      name: '[path][name].[ext]',
      emitFile: false, // Don't emit, using copy function to copy files over.
      outputPath: '../', // or // publicPath: '../'.
      context: paths.src,
    },
  },
  {
    // Handle SVG files imported as react components
    // e.g. import MySvg from './assets/svg/my-svg.svg';
    test: /\.svg$/,
    issuer: /\.js?$/,
    resourceQuery: { not: [/url/] },
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: [{
              name: 'removeViewBox',
              active: false,
            }],
          },
        },
      },
    ],
  },
  {
    // Handle SVG files imported as URLs by using a resourceQuery
    // e.g. import mySvg from './assets/svg/my-svg.svg?url';
    test: /\.svg$/,
    type: 'asset',
    resourceQuery: /url/,
  },
];
