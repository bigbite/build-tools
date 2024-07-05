const fs = require('fs');

/**
 * Function to get the package details from a given path.
 * @param {string} projectPath - The path to the project directory.
 * @returns {object|boolean} - The package details object or false if not found.
 */
const getPackageVersion = (projectPath) => {
  let verifiedPackageJson = false;
  let verifiedPackageLock = false;
  let name;
  const packageJsonPath = `${projectPath}/package.json`;
  const packageLockJsonPath = `${projectPath}/package-lock.json`;

  // // Check if already cached
  if (packageList[projectPath]) {
    return packageList[projectPath];
  }

  // Check for package.json or package-lock.json
  let json = {};
  if (fs.existsSync(packageJsonPath)) {
    json = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    verifiedPackageJson = packageJsonPath;
    const packageObject = json === Object(json) ? json : {};
    const packageNames = packageObject?.name?.split('/');
    name = packageNames?.[packageNames.length - 1] || '';
  }

  if (fs.existsSync(packageLockJsonPath)) {
    verifiedPackageLock = packageLockJsonPath;
  }

  // Check for other files with "Version:"
  let versionFilePaths = [];

  const files = fs.readdirSync(projectPath);
  for (const file of files) {
    const filePath = `${projectPath}/${file}`;
    if (fs.lstatSync(filePath).isFile()) {
      const content = fs.readFileSync(filePath, 'utf8');
      const match = content.match(/Version:\s*([\d]+\.[\d]+\.[\d]+(?:-[a-z]+\.[\d]+)?)/i);
      if (match) {
        versionFilePaths.push(filePath);
      }
    }
  }

  // Prepare the package details object
  const packageValues = {
    path: projectPath,
    verifiedPackageJson,
    verifiedPackageLock,
    versionFilePaths,
    name,
  };

  // Cache the result
  packageList[projectPath] = packageValues;

  return packageValues;
};

module.exports = {
  getPackageVersion,
};
