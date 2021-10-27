const presets = [
  [
    '@babel/preset-env',
    {
      corejs: '3',
      useBuiltIns: 'usage',
      modules: 'auto',
      shippedProposals: true,
    },
  ],

  /**
   * Config for using Preact.
   */
  [
    '@babel/preset-react',
    {
      pragma: 'h', // default pragma is React.createElement
      pragmaFrag: 'Fragment', // default is React.Fragment
      throwIfNamespace: false, // defaults to true
    },
  ],
];

const plugins = [
  ['@babel/plugin-proposal-optional-chaining'],
  ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
  ['@babel/plugin-proposal-class-properties'],
];

const overrides = [
  /**
   * Gutenberg overrides to set the correct pragma for React inside Gutenberg.
   */
  {
    presets: [
      [
        '@babel/preset-react',
        {
          pragma: 'wp.element.createElement', // default pragma is React.createElement
          pragmaFrag: 'wp.element.Fragment', // default is React.Fragment
          throwIfNamespace: false, // defaults to true
        },
      ],
    ],
  },
];

const env = {
  test: {
    presets: ['@babel/preset-env', '@babel/preset-react'],
  },
};

module.exports = {
  presets,
  plugins,
  overrides,
  env,
};
