const path = require('path');
const { terminal } = require('terminal-kit');
const webpackConfig = require('./webpack');
const { findProjectPath, findAllProjectPaths } = require('./utils/projectpaths');
const { getPackage } = require('./utils/get-package');

/**
 *
 * @param {object} env Current environment information.
 * @param {object} args Arguments passed to webpack.
 * @returns
 */
module.exports = (env, { mode, project = '', allProjects = false }) => {
  // Use env variables if working on Webpack >=5.
  const projects = (env.project ? env.project : project)
    .split(',')
    .filter((item) => item.length > 0);
  const isAllProjects = env['all-projects'] ? env['all-projects'] : allProjects;

  let paths = [];
  const targetDirs = ['client-mu-plugins', 'plugins', 'themes'];

  if (isAllProjects) {
    // Find all projects through-out the site.
    paths = findAllProjectPaths(targetDirs);
  } else if (projects.length === 0 && process.env.INIT_CWD) {
    // Is project root - a standalone build.
    paths.push(path.resolve('./'));
  } else {
    // List of projects.
    // Compile all project paths into array.
    paths = projects.map((projectItem) => {
      return findProjectPath(projectItem, targetDirs);
    });
  }

  let packages = [];

  try {
    packages = paths.map((path) => getPackage(path, false)).filter((item) => item);
  } catch (e) {
    throw e.message;
  }

  terminal('Processing the following projects:\n');
  packages.forEach((item) => {
    const regexDirs = targetDirs.join('|');
    const packagePath = item.packagePath.match(`((${regexDirs})\/(.+))?\/package\.json$`);
    console.log(item, regexDirs, packagePath);
    terminal.defaultColor(` * %s `, item.packageName).dim(`[%s]\n`, packagePath[0]);
  });
  terminal('\n');

  return packages.map((package) => {
    /**
     * Project config holds all information about a particular project,
     * rather than directly pulling out paths from files or attempting
     * to build them, use what is here.
     */
    const __PROJECT_CONFIG__ = {
      name: package.packageName,
      version: package.package.version,
      paths: {
        project: path.resolve(package.path),
        config: path.resolve(`${__dirname}/configs`),
        src: path.resolve(`${package.path}/src`),
        dist: path.resolve(`${package.path}/dist`),
        clean: [
          `${package.path}/dist/scripts`,
          `${package.path}/dist/styles`,
          `${package.path}/dist/static`,
        ],
        node_modules: path.resolve(package.path, 'node_modules'),
      },
      clean: true,
      copy: true,
      mode,
    };

    return webpackConfig(__PROJECT_CONFIG__, mode);
  });
};
