const path = require('path');

const eslintConfig = {
  extends: ['plugin:@wordpress/eslint-plugin/recommended', 'airbnb', 'prettier'],
  env: {
    browser: true,
  },
  rules: {
    complexity: ['error', 10],
    'prettier/prettier': ['error', require(path.resolve(__dirname, './prettier'))],
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
    '@wordpress/no-unsafe-wp-apis': 'warn',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@Components', path.resolve(process.cwd(), 'src/components')],
          ['Components', path.resolve(process.cwd(), 'src/components')],
          ['@Static', path.resolve(process.cwd(), 'src/static')],
          ['Static', path.resolve(process.cwd(), 'src/static')],
          ['@Utils', path.resolve(process.cwd(), 'src/utils')],
          ['Utils', path.resolve(process.cwd(), 'src/utils')],
        ],
        extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
      },
    }
  },
};

module.exports = eslintConfig;
