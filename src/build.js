const path = require('path');
const webpackConfig = require('./webpack');
const { findProjectPath, findAllProjectPaths } = require('./utils/projectpaths');

/**
 * 
 * @param {object} env Current environment information.
 * @param {object} args Arguments passed to webpack. 
 * @returns 
 */
module.exports = (env, { mode, project = '', allProjects = false }) => {
  // Use env variables if working on Webpack >=5.
  const projects = (env.project ? env.project : project).split(',').filter(item => item.length > 0);
  const isAllProjects = env['all-projects'] ? env['all-projects'] : allProjects;

  console.log('projects:', projects);

  let paths = [];

  if (isAllProjects) {
    // Find all projects through-out the site.
    paths = findAllProjectPaths();
  } else if (projects.length === 0 && process.env.INIT_CWD) {
    // Is project root - a standalone build.
    paths.push(path.resolve('./'));
  } else {
    // List of projects.
    // Compile all project paths into array.
    paths = projects.map((projectItem) => {
      return findProjectPath(projectItem);
    });
  }

  return paths.map((projectPath) => {
    return webpackConfig(projectPath, mode, path.basename(projectPath));
  });
};
