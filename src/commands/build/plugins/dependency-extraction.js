const DependencyExtraction = require('./custom/dependency-extraction');

module.exports = ({ name, customConfig }) => {
  return new DependencyExtraction({
    name,
    customConfig,
  });
};
