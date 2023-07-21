const fs = require('fs');
const { webpackAlias } = require('../../../utils/get-alias');

module.exports = ({ paths }) => {
  const projectConfig = `${paths.project}/tsconfig.json`;
  const config = fs.existsSync(projectConfig)
    ? projectConfig
    : `${paths.config}/tsconfig/tsconfig.json`;

  const setAliases = webpackAlias(paths.src);
  const aliasPaths = [];

  Object.keys(setAliases).forEach((item) => {
    const value = setAliases[item];
    aliasPaths[`${item}/*`] = [value.slice(value.indexOf('/src') + 1) + '/*'];
  });

  return [
    {
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            logInfoToStdOut: true,
            logLevel: 'info',
            configFile: config,
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
      exclude: /node_modules/,
    },
  ];
};
