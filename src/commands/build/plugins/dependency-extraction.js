const DependencyExtraction = require('./custom/dependency-extraction');

module.exports = ({ name }) => {
  return new DependencyExtraction({
    name,
  });
};
