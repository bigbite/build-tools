const CustomSimpleClean = require('./custom/simple-clean');

module.exports = ({ clean, paths }) =>
  clean &&
  new CustomSimpleClean({
    initialCleanPaths: paths.clean,
  });
