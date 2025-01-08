const fs = require('fs');
const path = require('path');

/**
 * Create entry points object from src folder.
 *
 * @param {string} src Project src path
 * @param {array} filteredEntrypoints entry point to build (ie frontend, editor, etc).
 * @returns {object} webpack entrypoints
 */
module.exports = (src, filteredEntrypoints) => {
  const entrypoints = `${src}/entrypoints`;
  const pathToEntryPoints = path.resolve(process.cwd(), entrypoints);

  if (!fs.existsSync(pathToEntryPoints)) {
    return fs.readdirSync(`${src}/blocks/`).filter(dir => fs.existsSync(`${src}/blocks/${dir}/index.js`)).map(dir => `${src}/blocks/${dir}/index.js`);
  }

  return fs.readdirSync(pathToEntryPoints).reduce(
    (accumulator, file) => {
      const type = file.split('.')[0];

      // If types are provided, only watch/build those.
      if (filteredEntrypoints.length > 0) {
        if (!filteredEntrypoints.includes(type)) {
          return accumulator;
        }
      }

      return {
        ...accumulator,
        [type]: path.resolve(pathToEntryPoints, file),
      };
  }, {});
};
