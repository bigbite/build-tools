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
  packages.forEach((pkg) => {
    terminal.defaultColor(` * %s `, pkg.name).dim(`[%s]\n`, pkg.relativePath);
  });
  terminal('\n');

  const gluedArgs = args.join(' ');

  packages.forEach((pkg) => {
    terminal
      .defaultColor(`Installing packages for `)
      .bold(`%s`, pkg.name)
      .dim(` [%s]\n`, pkg.relativePath);
    execSync(`npm ${gluedArgs}`, { cwd: pkg.path, stdio: 'inherit' });
    terminal.defaultColor('\n\n----------------------\n\n');
  });
};
