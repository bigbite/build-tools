const DependencyExtraction = require('./custom/dependency-extraction');

module.exports = ({ name }, externals) => {
  return new DependencyExtraction({
    name,
    externals,
  });
};
