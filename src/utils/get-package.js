const fs = require('fs');
const path = require('path');

/**
 * Retrieves the package.json file from a given directory and compiles it
 * along with additional data into a parse-able format by the rest of the script.
 *
 * @param {string} projectDir The project directory path where package.json is expected.
 * @param {boolean} throwError Whether to throw errors when package.json does not exist.
 * @returns
 */
const getPackage = (projectDir) => {
  const absolutePath = `${projectDir}/package.json`;

  if (packageList[absolutePath]) {
    return packageList[absolutePath];
  }

  if (!fs.existsSync(absolutePath)) {
    return false;
  }

  const json = JSON.parse(fs.readFileSync(absolutePath));
  const packageObject = json === Object(json) ? json : {};
  const packageNames = packageObject?.name?.split('/');
  const name = packageNames?.[packageNames.length - 1] || '';

  // const regexDirs = targetDirs.join('|');
  // const packagePath = absolutePath.match(`((${regexDirs})\/)?([^\/]+)\/package.json$`);
  const relativePath = path.relative(process.cwd(), absolutePath);

  const packageValues = {
    path: projectDir,
    absolutePath,
    // relativePath: packagePath[0],
    relativePath,
    name,
    json,
  };

  packageList[absolutePath] = packageValues;

  return packageValues;
};

module.exports = {
  getPackage,
};
