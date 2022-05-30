const installer = require('./installer/installer');

exports.command = 'ci';
exports.desc = 'Run an npm ci install process.';
exports.builder = (yargs) => {};

exports.handler = async ({}) => {
  installer(exports.command);
};
