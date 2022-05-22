const fs = require('fs');
const path = require('path');

/**
 * Create entry points object from src folder.
 *
 * @param {string} src Project src path
 * @returns {object} webpack entrypoints
 */
module.exports = (src) => {
  const entrypoints = `${src}/entrypoints`;
  const pathToEntryPoints = path.resolve(process.cwd(), entrypoints);

  if (!fs.existsSync(pathToEntryPoints)) {
    throw new Error(`Unable to find entrypoints folder in ${src}.`);
  }

  return fs.readdirSync(pathToEntryPoints).reduce(
    (accumulator, file) => ({
      ...accumulator,
      [file.split('.')[0]]: path.resolve(pathToEntryPoints, file),
    }),
    {},
  );
};
