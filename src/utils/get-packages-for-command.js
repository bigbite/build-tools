const path = require('path');
const { terminal } = require('terminal-kit');

const dirsExist = require('./dirs-exist');
const { getPackage } = require('./get-package');
const { findAllProjectPaths, validateProject } = require('./projectpaths');

/**
 * Get valid packages to run a command against.
 *
 * Bases results on the following logic:
 * - If the `site` flag is set, or the command was ran from within wp-content, all projects are targeted.
 * - If the `projects` flag is set, only those projects are targeted.
 * - If neither the `site` or `projects` flags are set, only the current project is targeted.
 *
 * @param {Object} args
 * @param {string} [args.projects] Comma separated list of projects to target.
 * @param {boolean} [args.site] Run the process from the root of a site, such as from wp-content.
 * @param {boolean} [args.requireSiteRoot] Require the process to be run from the site root directory.
 * @param {boolean} [args.quiet] Limit the amount of noise by removing webpack output.
 * @param {'development'|'production'} [args.mode] The mode to run the command in.
 *
 * @return {Array} An array of valid projects to run the command against.
 */
function getPackagesForCommand({
  projects = '',
  site = false,
  requireSiteRoot = false,
  quiet = false,
  mode = 'development',
}) {
  const targetDirs = global.targetDirs;

  const projectsList = projects
    .split(',')
    .map((item) => item.split('@')[0])
    .filter((item) => item.length > 0);

  const hasTargetDirs = dirsExist(targetDirs);

  if (requireSiteRoot && !hasTargetDirs) {
    terminal.red(`Command only works from the site root directory.\n`);
  }

  const isAllProjects = (site || hasTargetDirs) && (!projects || projectsList.length === 0);

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
        } else {
          packageNames.includes(projectName);
        }
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

  return validProjects;
}

module.exports = getPackagesForCommand;
