/**
 * Check that the given option is Boolean.
 * @param {mixed} value The value to check the type of.
 * @param {string} name Name of the option.
 */
const validateBoolean = (value, name = '') => {
  if (typeof value !== 'boolean') {
    throw new TypeError(`${name} option should be type of Boolean, got ${typeof value}`);
  }
};

/**
 * Check that the given option is an Array of Strings.
 * @param {mixed} value The value to check the type of.
 * @param {string} name Name of the option.
 */
const validateArrayOfStrings = (value, name = '') => {
  if (!Array.isArray(value)) {
    throw new TypeError(`${name} option should be type of Array, got ${typeof value}`);
  }

  if (!value.every((v) => typeof v === 'string')) {
    throw new TypeError(`${name} option should be an array of strings.`);
  }
};

/**
 * Validate an object of options to ensure correct types are being used.
 * @param {object} options Values to check types of.
 * @returns {object}
 */
module.exports = (options) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(options)) {
    switch (key) {
      case 'verbose':
      case 'removeEmptyDirectories':
        validateBoolean(value, key);
        break;
      case 'initialCleanPaths':
        validateArrayOfStrings(value, key);
        break;
      default:
        break;
    }
  }

  return options;
};
