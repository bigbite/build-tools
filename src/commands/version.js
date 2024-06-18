const dirsExist = require('../utils/dirs-exist');
const { terminal } = require('terminal-kit');
const fs = require('fs');
const path = require('path'); // Path module
const semver = require('semver');

exports.command = 'version [type] [projects]';
exports.desc = 'Run an npm version bump process.';
exports.builder = (yargs) => {
  yargs.option('type', {
    describe: 'type of version to bump.',
    default: 'string',
    type: 'string',
  });

  yargs.positional('projects', {
    describe: 'Comma separated list of projects to compile.',
    type: 'string',
    default: '',
  });

  yargs.option('site', {
    describe: `Run the process from the root of a site, such as from wp-content.`,
    default: false,
    type: 'boolean',
  });
};
exports.handler = async ({ type = '', projects = '', site = false }) => {
  // with no projects listed it returns a empty array
  const projectsList = projects.split(',').filter((item) => item.length > 0);
  const excludeDirs = ['node_modules', 'dist', 'build', 'vendor', 'vendor_prefixed', '.yalc'];
  const targetFiles = ['package.json', 'style.css', 'plugin.php'];

  const hasTargetDirs = dirsExist(targetDirs);

  const isAllProjects = (site || hasTargetDirs) && !projects;

  /**
   * Function to search for all files which are not in the excluded directories
   *
   * @param {string} basePath - The base directory to start searching from.
   * @param {Array} directoryNames - An array of directory names to match.
   * @returns {Array} - An array of matching directory paths.
   */
  const getAllFiles = (dirPath, arrayOfFiles) => {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        if (!excludeDirs.includes(file)) {
          arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
        }
      } else {
        arrayOfFiles.push(filePath);
      }
    });

    return arrayOfFiles;
  };

  /**
   * Function to find the files we want to use.
   * @param {string} baseDirs - Base directory to search from.
   * @param {Array} targets - Files we want to find
   */
  const findTargetFiles = (baseDirs, targets) => {
    baseDirs.forEach((baseDir) => {
      if (fs.existsSync(baseDir) && fs.statSync(baseDir).isDirectory()) {
        const allFiles = getAllFiles(baseDir);
        allFiles.forEach((filePath) => {
          const fileName = path.basename(filePath);
          if (targets.includes(fileName)) {
            incrementVersionNumber(fileName, filePath, type);
          }
        });
      } else {
        console.error(`Directory not found: ${baseDir}`);
      }
    });
  };

  /**
   * Recursively searches for directories matching given names.
   * @param {string} basePath - The base directory to start searching from.
   * @param {Array} directoryNames - An array of directory names to match.
   * @returns {Array} - An array of matching directory paths.
   */
  function findMatchingDirectories(basePath, directoryNames) {
    let matchingDirectories = [];
    searchDirectory(basePath, directoryNames, matchingDirectories);
    return matchingDirectories;
  }

  /**
   * Helper function to search directories recursively.
   * @param {string} currentPath - The current directory path.
   * @param {Array} directoryNames - An array of directory names to match.
   * @param {Array} matchingDirectories - The array where matching directories are stored.
   */
  function searchDirectory(currentPath, directoryNames, matchingDirectories) {
    let items;
    try {
      items = fs.readdirSync(currentPath);
    } catch (err) {
      console.error(`Error reading directory ${currentPath}: ${err.message}`);
      return;
    }

    items.forEach((item) => {
      const itemPath = path.join(currentPath, item);
      let stats;
      try {
        stats = fs.statSync(itemPath);
      } catch (err) {
        console.error(`Error getting item ${itemPath}: ${err.message}`);
        return;
      }

      if (stats.isDirectory()) {
        if (directoryNames.includes(item)) {
          matchingDirectories.push(itemPath);
        }
        // Recursively search inside this directory
        searchDirectory(itemPath, directoryNames, matchingDirectories);
      }
    });
  }

  /**
   * Function to increment the version in a package.json file.
   * @param {string} file - File to increment
   * @param {string} type - increment type
   */
  function incrementPackageJsonVersion(file, type) {
    if (fs.existsSync(file)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const oldVersion = packageJson.version;
        const newVersion = incrementVersionString(oldVersion, type);
        packageJson.version = newVersion;
        fs.writeFileSync(file, JSON.stringify(packageJson, null, 2), 'utf-8');
        terminal(`#${file}: ${oldVersion} -> ${newVersion}\n`);
      } catch (err) {
        console.error(`Error incrementing version in ${file}: ${err.message}`);
      }
    }
  }
  /**
   * Function to increment the version in a css file
   * @param {string} dir - File path
   * @param {string} type - Increment type.
   */
  function incrementStylesCssVersion(dir, type) {
    if (fs.existsSync(dir)) {
      try {
        let content = fs.readFileSync(dir, 'utf-8');
        const versionRegex = /Version:\s*([\d]+\.[\d]+\.[\d]+(?:-[a-z]+\.[\d]+)?)/i;
        const match = content.match(versionRegex);
        if (match) {
          const oldVersion = match[1];
          const newVersion = incrementVersionString(oldVersion, type);
          content = content.replace(versionRegex, `Version: ${newVersion}`);
          fs.writeFileSync(dir, content, 'utf-8');
          terminal(`#${dir}: ${oldVersion} -> ${newVersion}\n`);
        }
      } catch (err) {
        console.error(`Error incrementing version in ${dir}: ${err.message}`);
      }
    }
  }

  /**
   * Function to increment the version in a php file
   * @param {string} dir - File path
   * @param {string} type - Increment type.
   */
  function incrementPluginPhpVersion(dir, type) {
    if (fs.existsSync(dir)) {
      try {
        let content = fs.readFileSync(dir, 'utf-8');
        const versionRegex = /Version:\s*([\d]+\.[\d]+\.[\d]+(?:-[a-z]+\.[\d]+)?)/i;
        const match = content.match(versionRegex);
        if (match) {
          const oldVersion = match[1];
          const newVersion = incrementVersionString(oldVersion, type);
          content = content.replace(versionRegex, `Version: ${newVersion}`);
          fs.writeFileSync(dir, content, 'utf-8');
          terminal(`#${dir}: ${oldVersion} -> ${newVersion}\n`);
        }
      } catch (err) {
        console.error(`Error incrementing version in ${dir}: ${err.message}`);
      }
    }
  }

  /**
   * Function to increment the current version.
   * @param {string} version - current version
   * @param {string} type - type of version to increase.
   * @returns {string} version - updated version
   */
  function incrementVersionString(version, type) {
    if (!semver.valid(version)) {
      throw new Error(`Invalid version: ${version}`);
    }
    const [baseType, prerelease] = type.split(':');
    if (type === 'beta' && semver.prerelease(version)) {
      return semver.inc(version, 'prerelease', 'beta');
    }
    if (prerelease === 'beta') {
      // Handle pre-release increment
      if (semver.prerelease(version)) {
        const releaseEnum = Object.freeze({
          major: 'premajor',
          minor: 'preminor',
          patch: 'prepatch',
        });
        const releaseType = releaseEnum[baseType] ? releaseEnum[baseType] : false;
        semver.inc(version, releaseType, prerelease);
        // Convert stable version to pre-release
        return semver.inc(`${semver.inc(version, baseType)}-beta.0`, 'prerelease', 'beta');
      } else {
        // Handle stable version increment
        return semver.inc(version, baseType);
      }
    }
  }
  /**
   * Function to increase the version number depending on which file is found.
   * @param {string} file - file name
   * @param {string} path - file path
   * @param {string} type - type of version to increment.
   */
  function incrementVersionNumber(file, path, type) {
    switch (file) {
      case 'package.json':
        incrementPackageJsonVersion(path, type);
        break;
      case 'plugin.php':
        incrementPluginPhpVersion(path, type);
        break;
      case 'style.css':
        incrementStylesCssVersion(path, type);
        break;
      default:
        throw new Error(`Invalid file: ${file}`);
    }
  }

  try {
    if (projectsList.length === 0 && !isAllProjects) {
      terminal('No Projects Found\n');
    } else if (isAllProjects) {
      terminal('searching all projects.....\n');
      findTargetFiles(targetDirs, targetFiles);
    } else {
      terminal('finding all projects to increment....\n');
      const directoriesToSearch = findMatchingDirectories(
        path.resolve(process.cwd()),
        projectsList,
      );
      findTargetFiles(directoriesToSearch, targetFiles);
    }
  } catch (e) {
    terminal.red(e);
    process.exit(1);
  }
};
