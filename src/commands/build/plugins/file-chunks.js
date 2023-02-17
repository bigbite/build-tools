const FileChunks = require('./custom/file-chunks');

module.exports = ({ paths }, handlers) => {
  return new FileChunks({
    targetDir: paths.dist,
    handlers,
  });
};
