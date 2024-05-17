const path = require('path');
const { terminal } = require('terminal-kit');
const concurrently = require('concurrently');

const { findAllProjectPaths, validateProject } = require('./../utils/projectpaths');
const { getPackage } = require('./../utils/get-package');
const dirsExist = require('../utils/dirs-exist');

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
  const mode = production ? 'production' : 'development';
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

  const cmd = once ? 'wp-scripts build' : 'wp-scripts start';
  const webpackConfigPath = path.resolve(__dirname, '../../configs/webpack.config.js');

  // Build all projects concurrently
  concurrently(
    validProjects.map((pkg) => ({
      name: pkg.name,
      command: `echo "Running build..." && cd ${path.dirname(
        pkg.relativePath,
      )} && ${cmd} ./src/entrypoints/*.js --config ${webpackConfigPath}`,
    })),
  );
};
