const babelConfig = require('./babel.js');
const prettierConfig = require('./prettier.js');
const { eslintResolver } = require('./../src/utils/get-alias');

module.exports = {
	root: true,
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
  extends: ['airbnb', 'prettier', 'plugin:@typescript-eslint/recommended'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      ...babelConfig,
    },
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    settings: {
      'import/resolver': eslintResolver(),
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
  },
  plugins: ['@babel', 'react', 'prettier', 'jsdoc', 'import', '@typescript-eslint/eslint-plugin'],
  rules: {
    complexity: ['error', 10],
    'prettier/prettier': [
			'error',
			prettierConfig,
			{
				usePrettierrc: false
			}
		],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    ],
    'react/react-in-jsx-scope': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/require-default-props': 0,
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