const dirsExist = require('../utils/dirs-exist');
const { terminal } = require('terminal-kit');
const path = require('path');
const {
  incrementPackageJsonVersion,
  incrementVersionNumber,
} = require('./../utils/increment-version');

const { findAllProjectPaths, validateProject } = require('./../utils/projectpaths');
const { getPackage } = require('./../utils/get-package');

exports.command = 'version [type] [projects]';
exports.desc = 'Run an npm version bump process.';
exports.builder = (yargs) => {
  yargs.option('type', {
    describe: 'type of version to bump.',
    default: '',
    type: 'string',
  });

  yargs.positional('projects', {
    describe: 'Comma separated list of projects to compile.',
    type: 'string',
    default: '',
  });
};
exports.handler = async ({ type = '', projects = '' }) => {
  const projectsList = projects.split(',').filter((item) => item.length > 0);
  const hasTargetDirs = dirsExist(targetDirs);
  const isAllProjects = hasTargetDirs && !projects;
  const incrementType = type.toLowerCase();

  let packages = [];

  const updateVersionsInPackages = (packages, incrementType) => {
    packages.forEach((pkg) => {
      incrementPackageJsonVersion(
        pkg?.package.absolutePath,
        pkg?.package_lock.absolutePath,
        incrementType,
      );
      const fileNames = Object.keys(pkg);
      Object.values(pkg).forEach((file, key) => {
        if (fileNames[key] !== 'package' && fileNames[key] !== 'package_lock') {
          incrementVersionNumber(file.absolutePath, incrementType);
        }
      });
      8;
    });
  };

  try {
    if (projectsList.length === 0 && !isAllProjects) {
      // Increment projects in current directory
      terminal('\x1b[1mIncrementing Projects In \x1b[4mDirectory\x1b[0m...\n');
      packages.push(getPackage(path.resolve('./'), true));
    } else if (isAllProjects) {
      // Increment all projects i.e from wp-content folder
      terminal('\x1b[1mIncrementing \x1b[4mAll Projects\x1b[0m...\n');
      packages = findAllProjectPaths(targetDirs, false, true).map((path) => getPackage(path, true));
    } else {
      // Increment specified projects
      terminal('\x1b[1mIncrementing \x1b[4mList of Projects\x1b[0m...\n');

      packages = findAllProjectPaths(targetDirs, projectsList).map((path) =>
        getPackage(path, true),
      );

      const packageNames = packages.map((pkg) => pkg.name);
      projectsList.map((projectName) => {
        if (!packageNames.includes(projectName)) {
          terminal.red(`Error: Project ${projectName} does not exist.\n`);
        }
        packageNames.includes(projectName);
      });
    }
  } catch (e) {
    terminal.red(e);
    process.exit(1);
  }

  const validProjects = packages.filter((pkg) => validateProject(pkg, true));

  if (validProjects.length === 0) {
    terminal.red(`Error: No projects found\n`);
    process.exit(1);
  }

  updateVersionsInPackages(validProjects, incrementType);
};
