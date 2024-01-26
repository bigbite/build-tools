const fs = require('fs');
const { webpackAlias } = require('../../../utils/get-alias');

module.exports = ({ name, paths }) => {
  const projectConfig = `${paths.project}/tsconfig.json`;
  const toolsConfig = `${paths.config}/tsconfig.json`;

  const configFile = fs.existsSync(projectConfig) ? projectConfig : toolsConfig;

  const setAliases = webpackAlias(paths.src);
  const aliasPaths = [];

  Object.keys(setAliases).forEach((item) => {
    const value = setAliases[item];
    aliasPaths[`${item}/*`] = [value.slice(value.indexOf('src')) + '/*'];
  });

  return [
    {
      test: /\.tsx?$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }], '@babel/preset-react', '@babel/typescript'],
          },
        },
        {
          loader: 'ts-loader',
          options: {
            logInfoToStdOut: true,
            logLevel: 'info',
            configFile,
            compilerOptions: {
              baseUrl: paths.project,
              paths: {
                '~/*': ['src/*'],
                ...aliasPaths,
              },
            },
          },
        },
      ],
      include: paths.project + '/src',
      exclude: /node_modules/,
    },
    {
      test: /\.d\.ts$/,
      use: {
        loader: 'dts-loader'
      },
    }
  ];
};
