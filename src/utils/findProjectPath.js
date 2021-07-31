const fs = require('fs');
const path = require('path');

/**
 * Find the full project path
 * @param {String} projectName
 * @param {Array} folders
 *
 * @return {String|Boolean}
 */
const findProjectPath = (projectName, folders = ['client-mu-plugins', 'plugins', 'themes']) => {
  const testFolderPath = folder =>
    fs.existsSync(path.resolve(process.cwd(), `./${folder}/${projectName}`));

  const found = folders.find(testFolderPath);

  if (found) {
    return path.resolve(process.cwd(), `./${found}/${projectName}`);
  }

  return false;
};

const findAllProjectPaths = (folders = ['client-mu-plugins', 'plugins', 'themes']) => {
  let projects = [];

  folders.forEach(dir => {
    projects = projects.concat(
      fs
        .readdirSync(dir, { withFileTypes: true })
        .filter(
          dirent => fs.existsSync(`${dir}/${dirent.name}/src/entrypoints`) && dirent.isDirectory(),
        )
        .map(dirent => path.resolve(process.cwd(), `./${dir}/${dirent.name}`)),
    );
  });

  return projects;
};

module.exports = {
  findProjectPath,
  findAllProjectPaths,
};
