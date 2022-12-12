const fs = require('fs');

/**
 * Retrieves the package.json file from a given directory and compiles it
 * along with additional data into a parse-able format by the rest of the script.
 *
 * @param {string} path The project directory path where package.json is expected.
 * @param {boolean} throwError Whether to throw errors when package.json does not exist.
 * @returns
 */
const getPackage = (path, throwError = true) => {
  const absolutePath = `${path}/package.json`;

  if (packageList[absolutePath]) {
    return packageList[absolutePath];
  }

  if (!fs.existsSync(absolutePath)) {
    if (throwError) {
      throw new Error(
        `package.json does not exist for this project.\n\nPlease create one in: ${path}`,
      );
    }

    return false;
  }

  const json = JSON.parse(fs.readFileSync(absolutePath));
  const packageObject = json === Object(json) ? json : {};
  const packageNames = packageObject?.name?.split('/');
  const name = packageNames?.[packageNames.length - 1] || '';

  const regexDirs = targetDirs.join('|');
  const packagePath = absolutePath.match(`((${regexDirs})\/)?([^\/]+)\/package.json$`);

  const packageValues = {
    path,
    absolutePath,
    relativePath: packagePath[0],
    name,
    json,
  };

  packageList[absolutePath] = packageValues;

  return packageValues;
};

module.exports = {
  getPackage,
};
