const installer = require('./installer/installer');

exports.command = 'install';
exports.desc = 'Run an npm install process.';
exports.builder = (yargs) => {};

exports.handler = async ({}) => {
  installer(exports.command);
};
