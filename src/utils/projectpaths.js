const fs = require('fs');
const path = require('path');

const directoryExists = (directory) => {
  const exists = fs.existsSync(path.resolve(process.cwd(), `./${directory}`));

  if (exists) {
    return true;
  } else {
    console.warn(
      '\x1b[1m\x1b[33mWarning:\x1b[0m',
      `\x1b[1m\x1b[37mDirectory ${directory} does not exist.\x1b[0m`,
    );
    return false;
  }
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
const findProjectPath = (projectName, directorys = ['client-mu-plugins', 'plugins', 'themes']) => {
  const directory = directorys.find((directory) => projectExists(directory, projectName));
  if (directory) {
    return path.resolve(process.cwd(), `./${directory}/${projectName}`);
  }

  throw new Error(`Project ${projectName} does not exist.`);
};

const findAllProjectPaths = (directorys = ['client-mu-plugins', 'plugins', 'themes']) => {
  let projects = [];

  directorys.filter(directoryExists).forEach((directory) => {
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
