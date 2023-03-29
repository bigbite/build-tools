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

const findAllProjectPaths = (directories) => {
  let projects = [];

  directories.filter(directoryExists).forEach((directory) => {
    projects = projects.concat(
      fs
        .readdirSync(directory, { withFileTypes: true })
        .filter(
          (dirent) =>
            fs.existsSync(`${directory}/${dirent.name}/package.json`) && dirent.isDirectory(),
        )
        .map((dirent) => path.resolve(process.cwd(), `./${directory}/${dirent.name}`)),
    );
  });

  if (projects.length <= 0) {
    throw new Error('Cannot find any projects.');
  }

  return projects;
};

/**
 * Confirms the given package.json is a valid build-tools project
 * by looking for src/entrypoints
 */
const validateProject = (pkg) => {
  if (fs.existsSync(`${pkg.path}/src/entrypoints`)) {
    return true;
  }
  return false;
};

module.exports = {
  findAllProjectPaths,
  validateProject,
};
