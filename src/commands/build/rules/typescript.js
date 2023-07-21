const fs = require('fs');
const { webpackAlias } = require('../../../utils/get-alias');

module.exports = ({ name, paths }) => {
  let config = `${paths.project}/tsconfig.json`;

  /**
   * TypeScript config always treats files and paths as relative to
   * the tsconfig.json file. `ts-loader` will also not support anything
   * configuration outside of that `compilerOptions`. To get around this
   * we need to map across any common structures that aren't part of
   * `compilerOptions`, such as items that require paths relative to the
   * project. After mapping we then write the updated config to a new
   * file which then becomes our main tsconfig.json
   */
  if (!fs.existsSync(config)) {
    const sourceConfig = `${paths.config}/tsconfig/tsconfig-source.json`;

    const rawData = fs.readFileSync(sourceConfig);
    const configStructure = JSON.parse(rawData);

    configStructure.include = [
      ...configStructure.include,
      ...[
        `${paths.src}/types`
      ]
    ];

    const updatedConfig = JSON.stringify(configStructure, null, "\t");

    config = `${paths.config}/tsconfig/tsconfig-${name}.json`;

    fs.writeFileSync(config, updatedConfig);
  }

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
