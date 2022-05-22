const StyleLintPlugin = require('stylelint-webpack-plugin');
const StyleLintConfig = require('../../../../configs/stylelint');

module.exports = ({ paths }) =>
  new StyleLintPlugin({
    syntax: 'scss',
    context: paths.src,
    configBasedir: paths.config,
    config: StyleLintConfig,
  });
