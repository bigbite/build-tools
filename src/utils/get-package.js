const fs = require('fs');
const path = require('path');
const versionPattern = /Version:\s*([\d]+\.[\d]+\.[\d]+(?:-[a-z]+\.[\d]+)?)/i;

/**
 * Retrieves the names of all files in the specified directory.
 *
 * This function reads the contents of the given directory, filters out the directories,
 * and returns an array containing the names of all the files in the directory.
 *
 * @param {string} dirPath - The path to the directory to read.
 * @returns {array} An array of file names in the specified directory.
 **/

const getFilesInDirectory = (dirPath) => {
  return fs.readdirSync(dirPath).filter((file) => fs.statSync(path.join(dirPath, file)).isFile());
};

/**
 * Function to check if a file has a specified extension.
 * @param {string} filePath - The path to the file.
 * @param {string} extension - The extension to check for (e.g., '.json').
 * @returns {boolean} - Returns true if the file has the specified extension, otherwise false.
 */
const hasExtension = (filePath, extension) => {
  return path.extname(filePath).toLowerCase() === extension.toLowerCase();
};

/**
 * Converts a filename into a variable-friendly name by replacing non-alphanumeric characters with underscores
 * and removing the extension.
 *
 * @param {string} filename - The filename to convert.
 * @returns {string} - The converted variable-friendly name.
 */
const convertToVariableFriendlyName = (filename) => {
  // Remove the extension
  const baseName = filename.split('.').slice(0, -1).join('.');
  // Replace any non-alphanumeric characters with underscores
  return baseName.replace(/[^a-zA-Z0-9]/g, '_');
};

/**
 * Checks if the specified file contains a version string matching a given pattern.
 *
 * This function reads the content of the file at the given path and tests it against
 * a predefined version pattern.
 *
 * @param {string} filePath - The path to the file to check for a version string.
 * @returns {boolean} True if the file contains a version string matching the pattern, false otherwise.
 */
const containsVersion = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return versionPattern.test(content);
  } catch (err) {
    console.error(`Error reading file ${filePath}: ${err.message}`);
    return false;
  }
};

/**
 * Finds and returns an array of target files within the specified base directory.
 *
 * This function searches for files in the given base directory that either contain a version string,
 * or are named 'package.json' or 'package-lock.json'. It then returns an array of these file names,
 * ensuring there are no duplicate entries.
 *
 * @param {string} baseDir - The base directory to search for target files.
 * @returns {array} An array of target file names found in the base directory, with duplicates removed.
 */
const findTargetFiles = (baseDir) => {
  const files = getFilesInDirectory(baseDir);
  const targetFiles = files
    .filter((fileName) => {
      const filePath = path.join(baseDir, fileName);
      return (
        containsVersion(filePath) || fileName === 'package.json' || fileName === 'package-lock.json'
      );
    })
    .map((fileName) => fileName);
  // filter out duplicates
  return [...new Set(targetFiles)];
};

/**
 * Retrieves the package.json file from a given directory and compiles it
 * along with additional data into a parse-able format by the rest of the script.
 *
 * @param {string} path The project directory path where package.json is expected.
 * @param {boolean} throwError Whether to throw errors when package.json does not exist.
 * @returns
 */
const getPackage = (path, version = false) => {
  let files = [];
  let packageValues = {};

  if (!version) {
    files = ['package.json'];
  } else {
    files = findTargetFiles(path);
  }

  files.forEach((file) => {
    const absolutePath = `${path}/${file}`;

    if (packageList[absolutePath]) {
      return packageList[absolutePath];
    }

    if (!fs.existsSync(absolutePath)) {
      return false;
    }

    let fileData = {
      path,
      absolutePath,
    };

    if (hasExtension(absolutePath, '.json')) {
      const json = JSON.parse(fs.readFileSync(absolutePath));
      const packageObject = json === Object(json) ? json : {};
      const packageNames = packageObject?.name?.split('/');
      const name = packageNames?.[packageNames.length - 1] || '';

      const regexDirs = targetDirs.join('|');
      const packagePath = absolutePath.match(`((${regexDirs})\/)?([^\/]+)\/${file}$`);

      fileData = {
        ...fileData,
        relativePath: packagePath ? packagePath[0] : '',
        name,
        json,
      };
    }
    if (version) {
      packageValues[convertToVariableFriendlyName(file)] = fileData;
    } else {
      packageValues = fileData;
    }

    packageList[absolutePath] = fileData;
  });
  return packageValues;
};

module.exports = {
  getPackage,
};
