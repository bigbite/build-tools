const fs = require('fs');
const path = require('path');

/**
 * Create entry points object from src folder.
 *
 * @param {string} src Project src path
 * @param {array} targetedEntrypoints entry points to build (partial or full filename(s)).
 * @returns {object} webpack entrypoints
 */
module.exports = (src, targetedEntrypoints) => {
  const entrypoints = `${src}/entrypoints`;
  const pathToEntryPoints = path.resolve(process.cwd(), entrypoints);

  if (!fs.existsSync(pathToEntryPoints)) {
    throw new Error(`Unable to find entrypoints folder in ${src}.`);
  }

  return fs.readdirSync(pathToEntryPoints).reduce(
    (accumulator, file) => {
      // If no targeted entrypoints, build all.
      if (!targetedEntrypoints || targetedEntrypoints.length <= 0) {
        return {
          ...accumulator,
          [file.split('.')[0]]: path.resolve(pathToEntryPoints, file),
        };
      }
      
      // If currently file is not in targeted entrypoints, skip.
      if (!targetedEntrypoints.includes(file.split('.')[0])) {
        return accumulator;
      }

      return {
        ...accumulator,
        [file.split('.')[0]]: path.resolve(pathToEntryPoints, file),
      };
  }, {});
};
