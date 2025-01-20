const { terminal } = require('terminal-kit');
const { execSync } = require('child_process');
const yargs = require('yargs');
const args = yargs.argv._;

const getPackagesForCommand = require('./../../utils/get-packages-for-command');

module.exports = (commandType) => {
  if (!['ci', 'install'].includes(commandType)) {
    throw new Error('Not a valid comment type.');
  }

  const packages = getPackagesForCommand({
    requireSiteRoot: true,
  });

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
