#!/usr/bin/env node

const yargs = require('yargs');
const webpack = require('webpack');

const build = require('./build');

yargs.scriptName('bbbt');
yargs.usage('Usage: bbbt <command>');
yargs.help();
yargs.alias('h', 'help');
yargs.alias('v', 'version');
yargs.commandDir('./commands');
yargs.demandCommand(1, 'A command is required.');
yargs.parse();
return;
console.log(argv);

const config = {
  project: argv._[0] ? argv._[0] : '',
  allProjects: argv.site && !argv._[0] ? false : true,
  mode: argv.prod || argv.p ? 'production' : 'development',
};

console.log(config);

const webpackConfig = build(config);

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
