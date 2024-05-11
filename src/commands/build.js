const path = require('path');
const webpack = require('webpack');
const { terminal } = require('terminal-kit');
// eslint-disable-next-line import/no-extraneous-dependencies
const ora = require('ora');
const concurrently = require('concurrently');

// const webpackConfig = require('./build/webpack');

const { findAllProjectPaths, validateProject } = require('./../utils/projectpaths');
const { getPackage } = require('./../utils/get-package');
const dirsExist = require('../utils/dirs-exist');
// const getProjectConfig = require('../utils/get-project-config');

global.buildCount = 0;

exports.command = 'build [projects] [production] [once] [site] [quiet]';
exports.desc = 'Run a new build process.';
exports.builder = (yargs) => {
  yargs.positional('projects', {
    describe: 'Comma separated list of projects to compile.',
    type: 'string',
    default: '',
  });

  yargs.option('production', {
    describe: `Build and compile production assets.`,
    default: false,
    type: 'boolean',
  });

  yargs.option('once', {
    describe: `Only run the process once.`,
    default: false,
    type: 'boolean',
  });

  yargs.option('site', {
    describe: `Run the process from the root of a site, such as from wp-content.`,
    default: false,
    type: 'boolean',
  });

  yargs.option('quiet', {
    describe: `Limit the amount of noise by removing webpack output.`,
    default: false,
    type: 'boolean',
  });
};

exports.handler = async ({
  projects = '',
  site = false,
  production = false,
  once = false,
  quiet = false,
}) => {
  const currentLocation = path.basename(process.cwd());

  const mode = production ? 'production' : 'development';
  // Use env variables if working on Webpack >=5.
  const projectsList = projects.split(',').filter((item) => item.length > 0);
  const hasTargetDirs = dirsExist(targetDirs);
  const isAllProjects = (site || hasTargetDirs) && !projects;

  let packages = [];

  try {
    if (projectsList.length === 0 && !isAllProjects) {
      // Is project root - a standalone build.
      terminal(`\x1b[1mCompiling \x1b[4msingle\x1b[0m\x1b[1m project in ${mode} mode.\x1b[0m\n`);
      packages.push(getPackage(path.resolve('./')));
    } else if (isAllProjects) {
      // Find all projects through-out the site.
      terminal(`\x1b[1mCompiling \x1b[4mall\x1b[0m\x1b[1m projects in ${mode} mode.\x1b[0m\n`);
      packages = findAllProjectPaths(targetDirs).map((path) => getPackage(path));
    } else {
      // List of projects.
      terminal(`\x1b[1mCompiling \x1b[4mlist\x1b[0m\x1b[1m of projects in ${mode} mode.\x1b[0m\n`);
      packages = findAllProjectPaths(targetDirs, projectsList).map((path) => getPackage(path));

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

  const validProjects = packages.filter((pkg) => validateProject(pkg));

  if (!quiet) {
    const invalidProjects = packages.filter((pkg) => !validateProject(pkg));
    invalidProjects.map((invalidProject) =>
      terminal.red(`[${invalidProject.relativePath}] no entrypoints\n`),
    );
  }

  if (validProjects.length === 0) {
    terminal.red(`Error: No projects found\n`);
    process.exit(1);
  }

  terminal('Processing the following projects:\n');
  validProjects.forEach((pkg) => {
    terminal.defaultColor(` * %s `, pkg.name).dim(`[%s]\n`, pkg.relativePath);
  });
  terminal('\n');

  // Build all projects concurrently
  concurrently(
    validProjects.map(
      (pkg) =>
        `echo "Running build for ${path.dirname(pkg.relativePath)}" && cd ${path.dirname(
          pkg.relativePath,
        )} && wp-scripts start ./src/entrypoints/*.js --output-path=build`,
    ),
  );
};
