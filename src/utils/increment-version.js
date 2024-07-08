const fs = require('fs');
const { terminal } = require('terminal-kit');
const semver = require('semver');
const path = require('path');

/**
 * Function to normalize a version number to the format MAJOR.MINOR.PATCH.
 * @param {string} version - The version number to normalize.
 * @returns {string} - The normalized version number.
 */
function normalizeVersion(version) {
  const parts = version.split('.');

  while (parts.length < 3) {
    parts.push('0');
  }

  return parts.join('.');
}

/**
 * Function to increment the current version.
 * @param {string} version - current version
 * @param {string} type - type of version to increase.
 * @returns {string} version - updated version
 */
function incrementVersion(version, type) {
  let currentVersion = version;
  let normalisedVersion = version.split('.');
  if (normalisedVersion.length < 3) {
    currentVersion = normalizeVersion(version);
  }

  if (!semver.valid(currentVersion)) {
    throw new Error(`Invalid version: ${currentVersion}`);
  }

  const [baseType, prerelease] = type.split(':');

  if (prerelease === 'beta' || prerelease === 'rc') {
    const releaseEnum = Object.freeze({
      major: 'premajor',
      minor: 'preminor',
      patch: 'prepatch',
      prerelease: 'prerelease',
    });
    const releaseType = releaseEnum[baseType] ? releaseEnum[baseType] : false;
    return semver.inc(currentVersion, releaseType, prerelease, 1);
  } else {
    return semver.inc(currentVersion, baseType);
  }
}

/**
 * Function to get the version and then save it back to the file.
 * @param {string} filePath - file path.
 * @param {string} releaseType - type of version to increment.
 */
const incrementVersionNumber = (filePath, releaseType) => {
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      const versionRegex = /Version:\s*([\d]+\.[\d]+\.[\d]+(?:-[a-z]+\.[\d]+)?)/i;
      const match = content.match(versionRegex);
      if (match) {
        const oldVersion = match[1];
        let newVersion;

        if (releaseType === '') {
          newVersion = determineNextVersion(oldVersion);
        } else {
          newVersion = incrementVersion(oldVersion, releaseType);
        }

        content = content.replace(versionRegex, `Version: ${newVersion}`);
        fs.writeFileSync(filePath, content, 'utf-8');
        terminal(`#${filePath}: \x1b[31m${oldVersion} -> \x1b[32m${newVersion}\x1b[0m\n`);
      }
    } catch (err) {
      console.error(`\x1b[31mError incrementing version in ${filePath}: ${err.message}\x1b[0m`);
    }
  }
};

/**
 * Function to decide the next version if no version is provided.
 * @param {string} version - Current version.
 */
const determineNextVersion = (version) => {
  if (!semver.valid(version)) {
    throw new Error(`\x1b[31mInvalid version: ${version}\x1b[0m`);
  }
  if (semver.prerelease(version)) {
    return semver.inc(version, 'prerelease');
  }
  return semver.inc(version, 'patch'); // Automatically bump to the next patch version.
};

/**
 * Function to update the version in the package.json files.
 * @param {string} filePath - file path.
 * @param {string} releaseType - type of version to increment.
 */
const incrementPackageJsonVersion = (packageJsonPath, packageLockPath, releaseType) => {
  try {
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      let path = packageJsonPath;
      const oldVersion = packageJson.version;
      if (!packageJson.version) {
        return console.error(`\x1b[31mNo version set in ${path} unable to increment\x1b[0m`);
      }
      let newVersion;
      if (releaseType === '') {
        newVersion = determineNextVersion(oldVersion);
      } else {
        newVersion = incrementVersion(oldVersion, releaseType);
      }
      packageJson.version = newVersion;
      fs.writeFileSync(path, JSON.stringify(packageJson, null, 2), 'utf8');
      terminal(`#${path}: \x1b[31m${oldVersion} -> \x1b[32m${newVersion}\x1b[0m\n`);
      if (!fs.existsSync(packageLockPath)) {
        return;
      }
      path = packageLockPath;
      const packageJsonLock = JSON.parse(fs.readFileSync(path, 'utf8'));
      const lockoldVersion = packageJsonLock.version;
      packageJsonLock.version = packageJson.version;
      fs.writeFileSync(path, JSON.stringify(packageJsonLock, null, 2), 'utf8');
      terminal(`#${path}: \x1b[31m${lockoldVersion} -> \x1b[32m${newVersion}\x1b[0m\n`);
    }
  } catch (err) {
    console.error(`\x1b[31mError updating version in file ${path}: ${err.message}\x1b[0m`);
  }
};

module.exports = {
  incrementPackageJsonVersion,
  incrementVersionNumber,
};
