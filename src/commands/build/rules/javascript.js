/**
 * Creates the Babel rules and presets for Javascript.
 * @returns {object} Babel rules and presets for Javascript.
 */
module.exports = ({ paths }) => [
  {
    test: /\.jsx?$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', { targets: 'defaults' }], '@babel/preset-react'],
        },
      },
    ],
    include: paths.project + '/src',
    exclude: /node_modules/,
  },
];
