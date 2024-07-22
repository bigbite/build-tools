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
const findAllProjectPaths = (directories, projectsList, version = false) => {
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

  // Check the current directory separately
  if (fs.existsSync('./package.json') && !projectsList && version) {
    projects.push(path.resolve(process.cwd(), '.'));
  }

  if (projects.length <= 0) {
    throw new Error('Cannot find any projects.\n');
  }

  return projects;
};

/**
 * Confirms the given package.json is a valid build-tools project
 * by looking for src/entrypoints and checking the root directory contains a package.json.
 */
const validateProject = (pkg, version = false) => {
  if (version) {
    const files = Object.values(pkg);
    return files.some((file) => {
      if (
        fs.existsSync(`${file.path}/src/entrypoints`) ||
        fs.existsSync(`${file.path}/package.json`)
      ) {
        return true;
      }
      return false;
    });
  } else {
    if (fs.existsSync(`${pkg.path}/src/entrypoints`)) {
      return true;
    }
    return false;
  }
};

module.exports = {
  findAllProjectPaths,
  validateProject,
};
