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
    isAllProjects = _env['all-projects'] ? _env['all-projects'] : false;
  }

  let isProjectRoot = !projectName && process.env.INIT_CWD;

  if (isProjectRoot) {
    projectName = path.parse(process.env.INIT_CWD);
  }

  let PROJECT_PATHS = [];

  // Find all.
  if (isAllProjects) {
    PROJECT_PATHS = findAllProjectPaths();
  } else if (isProjectRoot) {
    PROJECT_PATHS.push(path.resolve('./'));
  } else {
    projectName.split(',').forEach((projectItem) => {
      PROJECT_PATHS.push(findProjectPath(projectItem));
    });
  }

  const COMPILERS = [];

  PROJECT_PATHS.forEach((PROJECT_PATH) => {
    COMPILERS.push(
      compileProjects(PROJECT_PATH, mode, path.basename(PROJECT_PATH))
    );
  });

  return COMPILERS;
};
