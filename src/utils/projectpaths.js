const fs = require('fs');
const path = require('path');
const { terminal } = require('terminal-kit');

const directoryExists = (directory) => {
  const exists = fs.existsSync(path.resolve(process.cwd(), `./${directory}`));

  if (exists) {
    return true;
  }

  terminal.yellow('Warning: Directory %s does not exist.\n', directory);

  return false;
};

/**
 * Searches a set of directories for sub-directories that contain a package.json
 *
 * @param {string[]} directories the directories to search
 * @param {string[]} projectsList an optional list of sub-directories to limit the search to
 * @returns {string[]} the complete paths to all project directories
 * @throws if no projects have been discovered
 */
const findAllProjectPaths = (directories, projectsList) => {
  let projects = [];

  directories.filter(directoryExists).forEach((directory) => {
    projects = projects.concat(
      fs
        .readdirSync(directory, { withFileTypes: true })
        .filter((dirent) => {
          if (!projectsList || projectsList.includes(dirent.name)) {
            return (
              fs.existsSync(`${directory}/${dirent.name}/package.json`) && dirent.isDirectory()
            );
          }
        })
        .map((dirent) => path.resolve(process.cwd(), `./${directory}/${dirent.name}`)),
    );
  });

  if (projects.length <= 0) {
    throw new Error('Cannot find any projects.\n');
  }

  return projects;
};

/**
 * Checks whether there are blocks that exist in the given path.
 *
 * Will check for the existence of {path}/src/blocks/{blockDir}/block.json
 *
 * @param {string} path The path to check where blocks exist.
 *
 * @return {boolean} Whether or not block files exist.
 */
const containsBlockFiles = (path) => {
  let exists = false;

  if (fs.existsSync(`${path}/src/blocks/`)) {
    exists = fs
      .readdirSync(`${path}/src/blocks/`)
      .find((dir) => fs.existsSync(`${path}/src/blocks/${dir}/block.json`));
  }

  return exists;
};

/**
 * Confirms the given package.json is a valid build-tools project
 * by looking for src/entrypoints
 */
const validateProject = (pkg) => {
  let hasBlockFiles = containsBlockFiles(pkg.path);
  const hasEntryPoints = fs.existsSync(`${pkg.path}/src/entrypoints`);

  return !!hasEntryPoints || !!hasBlockFiles;
};

module.exports = {
  findAllProjectPaths,
  containsBlockFiles,
  validateProject,
};
