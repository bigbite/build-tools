const AssetMessage = require('./custom/asset-meesage');
const path = require('path');
const chalk = require('chalk');

const handlers = [
  ( asset = {}) => {
    if (!asset?.sourceFilename) {
      return null;
    }

    const fullPath = path.resolve(asset.sourceFilename);
    const decoratedFilePath = chalk.underline(fullPath);

    if (/\/static\/(.+)\.(js|jsx|ts|tsx|php)/.test(asset.sourceFilename)) {
      return `\n${decoratedFilePath}\n  Non-static files should not be included in the static directory.\n`;
    }

    return null;
  },
];

module.exports = ({ paths }) => {
  return new AssetMessage({
    targetDir: paths.dist,
    handlers,
  });
};
