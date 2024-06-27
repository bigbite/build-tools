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
    if (semver.prerelease(currentVersion)) {
      const releaseEnum = Object.freeze({
        major: 'premajor',
        minor: 'preminor',
        patch: 'prepatch',
      });
      const releaseType = releaseEnum[baseType] ? releaseEnum[baseType] : false;
      semver.inc(version, releaseType, prerelease);
    }
    return semver.inc(`${semver.inc(currentVersion, baseType)}-beta.0`, 'prerelease', 'beta');
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
 * Function to update the package lock to match package.json file
 * @param {string} packageJsonPath - file path to package lock file.
 */
const updatePackageLockVersion = (packageJsonPath) => {
  const packageLockPath = path.join(path.dirname(packageJsonPath), 'package-lock.json');
  if (fs.existsSync(packageLockPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
      const oldVersion = packageLock.version;
      packageLock.version = packageJson.version;
      fs.writeFileSync(packageLockPath, JSON.stringify(packageLock, null, 2), 'utf8');
      terminal(
        `#${packageLockPath}: \x1b[31m${oldVersion} -> \x1b[32m${packageLock.version}\x1b[0m\n`,
      );
    } catch (err) {
      console.error(`\x1b[31mError updating version in ${packageLockPath}: ${err.message}\x1b[0m`);
    }
  }
};

/**
 * Function to update the version in the package.json files.
 * @param {string} filePath - file path.
 * @param {string} releaseType - type of version to increment.
 */
const incrementPackageJsonVersion = (filePath, releaseType) => {
  try {
    const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const oldVersion = packageJson.version;
    let newVersion;
    if (releaseType === '') {
      newVersion = determineNextVersion(oldVersion);
    } else {
      newVersion = incrementVersion(oldVersion, releaseType);
    }
    packageJson.version = newVersion;
    fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2), 'utf8');
    terminal(`#${filePath}: \x1b[31m${oldVersion} -> \x1b[32m${newVersion}\x1b[0m\n`);
    updatePackageLockVersion(filePath);
  } catch (err) {
    console.error(`\x1b[31mError updating version in file ${filePath}: ${err.message}\x1b[0m`);
  }
};

module.exports = {
  incrementPackageJsonVersion,
  incrementVersionNumber,
};
