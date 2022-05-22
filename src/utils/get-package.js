const fs = require('fs');

const getPackage = (path, throwError = true) => {
  let packageName = '';

  const packagePath = `${path}/package.json`;

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
  packageName = packageNames?.[packageNames.length - 1] || '';

  return {
    path,
    packagePath,
    packageName,
    package: packageJSON,
  };
};

module.exports = {
  getPackage,
};
