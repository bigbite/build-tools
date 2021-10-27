#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const webpack = require('webpack');

const build = require('./src/build');

const { argv } = yargs(hideBin(process.argv));

const env = {
  project: argv._[0],
  'all-projects': argv._[0] ? false : true,
};

const command = {
  mode: argv.prod || argv.p ? 'production' : 'development',
};

const webpackConfig = build(env, command);

console.log(webpackConfig);
const compiler = webpack(webpackConfig);

if (!argv.S || !argv.single) {
  compiler.watch(
    {
      aggregateTimeout: 300,
    },
    (err, stats) => {
      console.log(err, stats);

      process.stdout.write(stats.toString() + '\n');
    },
  );
}
