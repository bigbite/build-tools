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

const projectExists = (directory, projectName) => {
  if (!directoryExists(directory)) {
    return false;
  }

  return fs.existsSync(path.resolve(process.cwd(), `./${directory}/${projectName}`));
};

/**
 * Find the full project path
 * @param {String} projectName
 * @param {Array} directorys
 *
 * @return {String|Boolean}
 */
const findProjectPath = (projectName, directories) => {
  const foundDirectory = directories.find((directory) => projectExists(directory, projectName));

  if (foundDirectory) {
    return path.resolve(process.cwd(), `./${foundDirectory}/${projectName}`);
  }

  throw new Error(`Project ${projectName} does not exist.`);
};

const findAllProjectPaths = (directories) => {
  let projects = [];

  directories.filter(directoryExists).forEach((directory) => {
    projects = projects.concat(
      fs
        .readdirSync(directory, { withFileTypes: true })
        .filter(
          (dirent) =>
            fs.existsSync(`${directory}/${dirent.name}/src/entrypoints`) && dirent.isDirectory(),
        )
        .map((dirent) => path.resolve(process.cwd(), `./${directory}/${dirent.name}`)),
    );
  });

  if (projects.length <= 0) {
    throw new Error('Cannot find any projects.');
  }

  return projects;
};

module.exports = {
  findProjectPath,
  findAllProjectPaths,
};
