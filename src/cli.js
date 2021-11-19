#!/usr/bin/env node

const yargs = require('yargs');

yargs.scriptName('bbb');
yargs.usage('Usage: bbb <command>');
yargs.help();
yargs.alias('h', 'help');
yargs.alias('v', 'version');
yargs.commandDir('./commands');
yargs.demandCommand(1, 'A command is required.');
yargs.parse();
