const path = require('path');
const ora = require('ora');
const { terminal } = require('terminal-kit');
const { execSync } = require('child_process');

const { findProjectPath, findAllProjectPaths } = require('./../utils/projectpaths');
const { getPackage } = require('./../utils/get-package');
const dirsExist = require('../utils/dirs-exist');


const spinner = ora();


exports.command = 'cmd [projects] [options]';
exports.aliases = 'run [projects] [options]';
exports.desc = 'Run a command within each project';
exports.builder = (yargs) => {
  yargs.option('projects', {
    describe: 'Comma separated list of projects to run the command on.',
    type: 'string',
    default: '',
  });

  yargs.option('continueOnFail', {
    alias: 'F',
    describe: 'Continue running the commands even on failure',
    type: 'boolean',
  });

  yargs.option('quiet', {
    alias: 'q',
    describe: 'Hide the output of stdout',
    boolean: true,
    type: 'boolean',
  })
};

exports.handler = ({
  projects = '',
  continueOnFail,
  quiet,
  _: parts,
  $0,
}) => {
  const projectsList = projects.split(',').filter((item) => item.length > 0);
  const hasTargetDirs = dirsExist(targetDirs);
  const isAllProjects = hasTargetDirs && !projects;

  parts.shift();

  if (parts.length === 0) {
    terminal.red().bold('Error: ')
      .defaultColor('command cannot be empty\n');
    terminal.yellow('Usage: ')
      .defaultColor(`${$0} cmd [projects] [opts] -- <command>\n`);
    process.exit(1);
  }

  const command = parts.join(' ');

  let paths = [];

  try {
    if (projectsList.length === 0 && !isAllProjects) {
      paths.push(path.resolve('./'));
    } else if (isAllProjects) {
      paths = findAllProjectPaths(targetDirs);
    } else {
      paths = projectsList.map((projectItem) => findProjectPath(projectItem, targetDirs));
    }
  } catch (e) {
    terminal.red(e);
    process.exit(1);
  }


  let packages = [];

  try {
    packages = paths.map((item) => getPackage(item, false)).filter((item) => item);
  } catch (e) {
    terminal.red(e);
    process.exit(1);
  }

  let fails = 0;
  spinner.clear();
  spinner.start(`Running command '${command}'\n`);
  packages.forEach((pkg) => {
    
    try {
      execSync(command, { cwd: pkg.path, stdio: quiet ? 'pipe' : 'inherit' });
      spinner.succeed();
    } catch (err) {
      spinner.fail();
      terminal.red(err.stderr);
      terminal('\n\n');

      if (!continueOnFail) {
        process.exit(1);
      }

      fails += 1;
    }
  });

  if (fails > 0) {
    terminal.red('Some commands failed to execute\n');
    process.exit(1);
  }
  
  process.exit(0);
}
