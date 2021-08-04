const path = require('path');
const compileProjects = require('./compileProjects.js');

const {
  findProjectPath,
  findAllProjectPaths,
} = require('./utils/findProjectPath.js');

module.exports = (env, { mode, project = '', allProjects = false }) => {
  const isAllProjects = env['all-projects'] ? env['all-projects'] : allProjects;

  let paths = [];

  // Find all.
  if (isAllProjects) {
    paths = findAllProjectPaths();
  } else if (projects.length === 0 && process.env.INIT_CWD) {
    // Is project root - a standalone build.
    paths.push(path.resolve('./'));
  } else {
    // Use env variables if working on Webpack >=5.
    const projects = (env.project ? env.project : project).split(',');

    paths = projects.map((projectItem) => {
      return findProjectPath(projectItem);
    });
  }

  return paths.map((projectPath) => {
    return compileProjects(projectPath, mode, path.basename(projectPath));
  });
};
