const fs = require('fs');
const path = require('path');

const folderExists = (folder) => {
  const exists = fs.existsSync(path.resolve(process.cwd(), `./${folder}`));

  if (exists) {
    return true;
  } else {
    console.warn(
      '\x1b[1m\x1b[33mWarning:\x1b[0m',
      `\x1b[1m\x1b[37mDirectory ${folder} does not exist.\x1b[0m`
    );
    return false;
  }
};

const projectExists = (folder, projectName) => {
  if (!folderExists(folder)) {
    return false;
  }

  return fs.existsSync(
    path.resolve(process.cwd(), `./${folder}/${projectName}`)
  );
};

/**
 * Find the full project path
 * @param {String} projectName
 * @param {Array} folders
 *
 * @return {String|Boolean}
 */
const findProjectPath = (
  projectName,
  folders = ['client-mu-plugins', 'plugins', 'themes']
) => {
  const folder = folders.find((folder) => projectExists(folder, projectName));
  if (folder) {
    return path.resolve(process.cwd(), `./${folder}/${projectName}`);
  }

  throw new Error(`Project ${projectName} does not exist.`);
};

const findAllProjectPaths = (
  folders = ['client-mu-plugins', 'plugins', 'themes']
) => {
  let projects = [];

  folders.filter(folderExists).forEach((folder) => {
    projects = projects.concat(
      fs
        .readdirSync(folder, { withFileTypes: true })
        .filter(
          (dirent) =>
            fs.existsSync(`${folder}/${dirent.name}/src/entrypoints`) &&
            dirent.isDirectory()
        )
        .map((dirent) =>
          path.resolve(process.cwd(), `./${folder}/${dirent.name}`)
        )
    );
  });

  if (projects.length <= 0) {
    throw new Error('Cannot find any projects.');
  }

  return projects;
};

module.exports = {
  findProjectPath,
  findAllProjectPaths,
};
