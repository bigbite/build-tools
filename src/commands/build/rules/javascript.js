/**
 * Creates the Babel rules and presets for Javascript.
 * @returns {object} Babel rules and presets for Javascript.
 */
module.exports = () => [
  {
    test: /\.(js|jsx)$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', { targets: 'defaults' }], '@babel/preset-react'],
        },
      },
    ],
  },
];
