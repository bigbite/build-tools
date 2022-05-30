const { terminal } = require('terminal-kit');
const { execSync } = require('child_process');
const yargs = require('yargs');
const args = yargs.argv._;

const { findAllProjectPaths } = require('./../../utils/projectpaths');
const { getPackage } = require('./../../utils/get-package');
const dirsExist = require('./../../utils/dirs-exist');

module.exports = (commandType) => {
  if (!['ci', 'install'].includes(commandType)) {
    throw new Error('Not a valid comment type.');
  }

  const hasTargetDirs = dirsExist(targetDirs);

  if (!hasTargetDirs) {
    throw new Error('Recursive install only works from the site root directory.');
  }

  let paths = findAllProjectPaths(targetDirs);

  let packages = [];

  try {
    packages = paths.map((item) => getPackage(item, false)).filter((item) => item);
  } catch (e) {
    terminal.red(e);
    process.exit(1);
  }

  terminal('Installing packages for the following projects:\n');
  packages.forEach((package) => {
    terminal.defaultColor(` * %s `, package.name).dim(`[%s]\n`, package.relativePath);
  });
  terminal('\n');

  const gluedArgs = args.join(' ');

  packages.forEach((package) => {
    terminal
      .defaultColor(`Installing packages for `)
      .bold(`%s`, package.name)
      .dim(` [%s]\n`, package.relativePath);
    execSync(`npm ${gluedArgs}`, { cwd: package.path, stdio: 'inherit' });
    terminal.defaultColor('\n\n----------------------\n\n');
  });
};
