const fs = require('fs');
const path = require('path');
/**
 * Check if a directory exists.
 * @param {string} directory - The directory path to check.
 * @returns {boolean} - True if the directory exists, otherwise false.
 */
const directoryExists = (directory) =>
  fs.existsSync(directory) && fs.lstatSync(directory).isDirectory();

/**
 * Check if a project directory contains relevant files.
 * @param {string} projectPath - The path to the project directory.
 * @param {string[]} [projectsList] - The list of specific project names to look for.
 * @returns {boolean} - True if the project directory contains relevant files, otherwise false.
 */
const isValidProjectDirectory = (projectPath, projectsList) => {
  const packageJsonExists = fs.existsSync(`${projectPath}/package.json`);
  const packageLockJsonExists = fs.existsSync(`${projectPath}/package-lock.json`);
  const versionFileExists = fs.readdirSync(projectPath).some((file) => {
    const filePath = `${projectPath}/${file}`;
    if (fs.lstatSync(filePath).isFile()) {
      const content = fs.readFileSync(filePath, 'utf8');
      return /\bVersion:\s*([^\r\n]*)/.test(content);
    }
    return false;
  });

  return packageJsonExists || packageLockJsonExists || versionFileExists;
};

/**
 * Find all project paths within the specified directories, including the current directory.
 * @param {string[]} directories - The list of directories to search.
 * @param {string[]} [projectsList] - The list of specific project names to look for.
 * @returns {string[]} - An array of project paths.
 */
const findAllProjectPaths = (directories, projectsList) => {
  let projects = [];

  directories.filter(directoryExists).forEach((directory) => {
    fs.readdirSync(directory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory()) // Only process directories
      .forEach((dirent) => {
        const projectPath = path.resolve(directory, dirent.name);
        if (!projectsList || projectsList.includes(dirent.name)) {
          if (isValidProjectDirectory(projectPath, projectsList)) {
            projects.push(projectPath);
          }
        }
      });
  });

  // Only get current directory if no projects are specified.
  if (!projectsList) {
    // Include current directory in the search
    const currentDirectory = '.';
    if (
      directoryExists(currentDirectory) &&
      isValidProjectDirectory(currentDirectory, projectsList)
    ) {
      projects.push(currentDirectory);
    }
  }

  if (projects.length <= 0) {
    throw new Error('Cannot find any projects.\n');
  }

  return projects;
};

module.exports = {
  findAllProjectPaths,
};
