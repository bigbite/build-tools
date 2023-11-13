const path = require('path');
const ora = require('ora');const { terminal } = require('terminal-kit');
const { execSync } = require('child_process');

const { findProjectPath, findAllProjectPaths } = require('./../utils/projectpaths');
const { getPackage } = require('./../utils/get-package');
const dirsExist = require('../utils/dirs-exist');


const spinner = ora();


exports.command = 'cmd [projects] [command]';
exports.desc = 'Run a command within each project';
exports.builder = (yargs) => {
  yargs.positional('projects', {
    describe: 'Comma separated list of projects to compile.',
    type: 'string',
    default: '',
  });

  yargs.positional('command', {
    string: true,
    demand: true,
  });

  yargs.option('continueOnFail', {
    alias: 'F',
    describe: 'Continue running the commands even on failure',
  });

  yargs.option('quiet', {
    alias: 'q',
    describe: 'Hide the output of stdout',
    boolean: true,
  })

  yargs.demandOption('command', 'A command must be set');
};

exports.handler = ({
  projects = '',
  command,
  continueOnFail,
  quiet,
}) => {
  const projectsList = projects.split(',').filter((item) => item.length > 0);
  const hasTargetDirs = dirsExist(targetDirs);
  const isAllProjects = hasTargetDirs && !projects;

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

      if (!quiet) {
        terminal.red(err.stderr);
      }

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
