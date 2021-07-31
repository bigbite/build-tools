const path = require('path');
const webpack = require('webpack');
const compileProjects = require('./compileProjects.js');

const {
  findProjectPath,
  findAllProjectPaths,
} = require('./utils/findProjectPath.js');

module.exports = (_env, { mode, project = false, allProjects = false }) => {
  const WEBPACK_VERSION = webpack.version.split('.');
  let projectName = project;
  let isAllProjects = allProjects;

  if (WEBPACK_VERSION[0] > '4') {
    projectName = _env.project ? _env.project : false;
    isAllProjects = _env.allprojects ? _env.allprojects : false;
  }

  let isProjectRoot = false;

  if (!projectName && process.env.INIT_CWD) {
    projectName = path.parse(process.env.INIT_CWD);
    isProjectRoot = true;
  }

  let PROJECT_PATHS = [];

  // Find all.
  if (isAllProjects) {
    PROJECT_PATHS = findAllProjectPaths();
  } else if (isProjectRoot) {
    PROJECT_PATHS.push(path.resolve('./'));
  } else {
    projectName.split(',').forEach((projectItem) => {
      const foundProject = findProjectPath(projectItem);
      if (!foundProject)
        throw new Error(`Project ${projectItem} does not exist.`);
      PROJECT_PATHS.push(foundProject);
    });
  }

  if (PROJECT_PATHS.length <= 0) {
    throw new Error("Can't find project files.");
  }

  const COMPILERS = [];

  PROJECT_PATHS.forEach((PROJECT_PATH) => {
    COMPILERS.push(
      compileProjects(PROJECT_PATH, mode, path.basename(PROJECT_PATH))
    );
  });

  return COMPILERS;
};
