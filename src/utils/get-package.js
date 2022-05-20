const fs = require('fs');

global.packageList = {};

const getPackage = (path, throwError = true) => {
  const packagePath = `${path}/package.json`;

  if (packageList[packagePath]) {
    return packageList[packagePath];
  }

  if (!fs.existsSync(packagePath)) {
    if (throwError) {
      throw new Error(
        `package.json does not exist for this project.\n\nPlease create one in: ${path}`,
      );
    }

    return false;
  }

  const packageJSON = JSON.parse(fs.readFileSync(packagePath));
  const packageObject = packageJSON === Object(packageJSON) ? packageJSON : {};
  const packageNames = packageObject?.name?.split('/');
  const packageName = packageNames?.[packageNames.length - 1] || '';

  const packageValues = {
    path,
    packagePath,
    packageName,
    package: packageJSON,
  };

  packageList[packagePath] = packageValues;

  return packageValues;
};

module.exports = {
  getPackage,
};
