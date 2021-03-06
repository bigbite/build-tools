const babelConfig = require('./babel.js');

module.exports = {
  globals: {
    __DEV__: true,
    __PROD__: true,
    __TEST__: true,
    wp: true,
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb', 'prettier'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      ...babelConfig,
    },
  },
  plugins: ['@babel', 'react', 'prettier', 'jsdoc'],
  rules: {
    complexity: ['error', 10],
    'prettier/prettier': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/react-in-jsx-scope': 0,
    'react/forbid-prop-types': 0,
    'arrow-parens': 2,
    'jsdoc/require-jsdoc': [
      'error',
      {
        require: {
          ArrowFunctionExpression: true,
          ClassDeclaration: true,
          ClassExpression: true,
          FunctionDeclaration: true,
          FunctionExpression: true,
          MethodDefinition: true,
        },
      },
    ],
  },
};
