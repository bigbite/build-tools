const ESLint = require('./eslint');
const TemplateGenerator = require('./template-generator');
const MiniCssExtract = require('./minicssextract');
const StyleLint = require('./stylelint');
const Clean = require('./clean');
const Copy = require('./copy');
const DependencyExtraction = require('./dependency-extraction');
const FileChunks = require('./file-chunks');

module.exports = {
  ESLint,
  TemplateGenerator,
  MiniCssExtract,
  StyleLint,
  Clean,
  Copy,
  DependencyExtraction,
  FileChunks,
};
