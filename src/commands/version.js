const dirsExist = require('../utils/dirs-exist');
const { terminal } = require('terminal-kit');
const fs = require('fs');
const path = require('path');
const {
  incrementPackageJsonVersion,
  incrementVersionNumber,
} = require('./../utils/increment-version');

exports.command = 'version [type] [projects]';
exports.desc = 'Run an npm version bump process.';
exports.builder = (yargs) => {
  yargs.option('type', {
    describe: 'type of version to bump.',
    default: '',
    type: 'string',
  });

  yargs.positional('projects', {
    describe: 'Comma separated list of projects to compile.',
    type: 'string',
    default: '',
  });
};
exports.handler = async ({ type = '', projects = '' }) => {
  const projectsList = projects.split(',').filter((item) => item.length > 0);
  const excludeDirs = ['node_modules', 'dist', 'build', 'vendor', 'vendor_prefixed', '.yalc'];
  const docCommentPattern = /\bVersion:\s*([^\r\n]*)/;
  const hasTargetDirs = dirsExist(targetDirs);
  const isAllProjects = hasTargetDirs && !projects;
  const incrementType = type.toLowerCase();
  /**
   * Function to search for all files which are not in the excluded directories
   *
   * @param {string} basePath - The base directory to start searching from.
   * @param {Array} directoryNames - An array of directory names to match.
   * @returns {Array} - An array of matching directory paths.
   */
  const getAllFiles = (dirPath, arrayOfFiles = []) => {
    const files = fs.readdirSync(dirPath);

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
   * Function to find target files to increment
   *
   * @param {array} baseDirs - Directories to search
   * @param {string} releaseType - version type to increment.
   */
  const findTargetFiles = (baseDirs, releaseType) => {
    if (projectsList.length === 0) {
      const currentDir = process.cwd();
      searchDirectoryForVersionComment(currentDir, releaseType);
    }

    baseDirs.forEach((baseDir) => {
      if (fs.existsSync(baseDir) && fs.statSync(baseDir).isDirectory()) {
        const allFiles = getAllFiles(baseDir);
        allFiles.forEach((filePath) => {
          const fileName = path.basename(filePath);

          if (containsVersion(filePath)) {
            incrementVersionNumber(filePath, releaseType);
          }

          if (fileName === 'package.json') {
            incrementPackageJsonVersion(filePath, releaseType);
          }
        });
      } else {
        console.error(`\x1b[31mDirectory not found: ${baseDir}\x1b[0m`);
      }
    });
  };

  /**
   * Function to search file for version in doc comment
   *
   * @param {string} currentDir - Current directory
   * @param {string} releaseType - version type to increment.
   */
  const searchDirectoryForVersionComment = (currentDir, releaseType) => {
    const files = fs.readdirSync(currentDir);

    files.forEach((file) => {
      const filePath = path.join(currentDir, file);

      if (fs.statSync(filePath).isFile() && containsVersion(filePath)) {
        incrementVersionNumber(filePath, releaseType);
      }
      if (file === 'package.json') {
        incrementPackageJsonVersion(filePath, releaseType);
      }
    });
  };

  /**
   * Function to check if a file contains the version
   * @param {string} filePath - file path to file being checked.
   * @returns {boolean} - true or false if version exists.
   */
  const containsVersion = (filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return docCommentPattern.test(content);
    } catch (err) {
      console.error(`\x1b[31mError reading file ${filePath}: ${err.message}\x1b[0m`);
      return false;
    }
  };

  /**
   * Function to find matching directories
   * @param {string} basePath - Current location
   * @returns {array} - array of directories to search
   */
  const findMatchingDirectories = (basePath, projectName) => {
    let matchingDirectories = [];
    searchDirectory(basePath, projectName, matchingDirectories);
    return matchingDirectories;
  };

  /**
   * Function to search specific directory
   * @param {string} currentPath - Current location
   * @param {string} projectName - Project to search
   * @param {array} matchingDirectories - Directories to search
   */
  const searchDirectory = (currentPath, projectName, matchingDirectories) => {
    let items;
    try {
      items = fs.readdirSync(currentPath);
    } catch (err) {
      console.error(`\x1b[31mError reading directory ${currentPath}: ${err.message}\x1b[0m`);
      return;
    }

    items.forEach((item) => {
      const itemPath = path.join(currentPath, item);
      let stats;
      try {
        stats = fs.statSync(itemPath);
      } catch (err) {
        console.error(`\x1b[31mError getting item ${itemPath}: ${err.message}\x1b[0m`);
        return;
      }

      if (stats.isDirectory()) {
        if (item.includes(projectName)) {
          matchingDirectories.push(itemPath);
        }
        // Recursively search inside this directory
        searchDirectory(itemPath, projectName, matchingDirectories);
      }
    });
  };

  try {
    if (projectsList.length === 0 && !isAllProjects) {
      // Increment projects in current directory
      terminal('\x1b[1mIncrementing Projects In \x1b[4mDirectory\x1b[0m...\n');
      searchDirectoryForVersionComment(path.resolve(process.cwd()), incrementType);
    } else if (isAllProjects) {
      // Increment all projects i.e from wp-content folder
      terminal('\x1b[1mIncrementing \x1b[4mAll Projects\x1b[0m...\n');
      findTargetFiles(targetDirs, incrementType);
    } else {
      // Increment specified projects
      terminal('\x1b[1mIncrementing \x1b[4mList of Projects\x1b[0m...\n');
      const directoriesToSearch = projectsList.flatMap((projectName) =>
        findMatchingDirectories(path.resolve(process.cwd()), projectName),
      );
      findTargetFiles(directoriesToSearch, incrementType);
    }
  } catch (e) {
    terminal.red(e);
    process.exit(1);
  }
};
