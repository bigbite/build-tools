const StyleLintPlugin = require('stylelint-webpack-plugin');
const StyleLintConfig = require('../../configs/stylelint.js');

module.exports = ({ paths }) => {
  return new StyleLintPlugin({
    syntax: 'scss',
    context: paths.src,
    configBasedir: paths.config,
    config: StyleLintConfig,
  });
};
