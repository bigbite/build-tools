const fs = require('fs');

global.packageList = {};

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
