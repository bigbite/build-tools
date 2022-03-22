#!/usr/bin/env node

const yargs = require('yargs');

yargs.scriptName('build-tools');
yargs.usage('Usage: build-tools <command>');
yargs.help();
yargs.alias('h', 'help');
yargs.alias('v', 'version');
yargs.commandDir('./commands');
yargs.demandCommand(1, 'A command is required.');
yargs.parse();
