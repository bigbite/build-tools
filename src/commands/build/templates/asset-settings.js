const path = require('path');

const getFileName = (file, mode = 'develop') => {
  const parsedFile = path.parse(file);

  let name = parsedFile.name.replace(/-/g, '_').toUpperCase();

  if (mode === 'production') {
    const splitName = name.split('_');
    splitName.pop();
    name = splitName.join('_');
  }

  return name;
};

const getExtension = (file) => {
  const parsedFile = path.parse(file);
  return parsedFile.ext.split('.')[1].toUpperCase();
};

// eslint-disable-next-line arrow-body-style
const assetSettingsTemplate = (files, project, mode, version = 'v0.0.0') => {
  const setProject = project === '.' ? path.basename(path.resolve('./')) : project;
  const projectName = setProject.replace(/-/g, '_').toUpperCase();

  const fileDefinitions = (file) => {
    const parsedFile = path.parse(file);
    const name = getFileName(file, mode);
    const extension = getExtension(file);
    return `define( '${projectName}_${name}_${extension}', '${parsedFile.base}' );`;
  };

  const dependencyDefinitions = (file) => {
    if (!/(js|jsx)$/.test(file)) {
      return '';
    }

    const parsedFile = path.parse(file);
    const name = getFileName(file, mode);
    const { dependencies } = global.DependencyExtraction[project][parsedFile.name];
    return `define( '${projectName}_${name}_DEPENDENCIES', ${JSON.stringify(dependencies)} );`;
  };

  return `<?php
/**
 * Asset settings generated by webpack.
 *
 * WARNING: Do not edit this file!
 * It will be created and updated automatically whenever new assets are created.
 *
 * phpcs:disable -- As this file is auto-generated, it should be excluded from linting.
 */

${files.map(fileDefinitions).join(`\n`)}
${files.map(dependencyDefinitions).join(`\n`)}
define( '${project.replace(/-/g, '_').toUpperCase()}_VERSION', '${version}' );
// phpcs:enable
`;
};

module.exports = assetSettingsTemplate;
