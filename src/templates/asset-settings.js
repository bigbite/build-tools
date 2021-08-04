const path = require('path');

const assetSettingsTemplate = ({ htmlWebpackPlugin }, project, mode) => `<?php
/**
 * Asset settings generated by webpack.
 *
 * WARNING: Do not edit this file!
 * It will be created and updated automatically whenever new assets are created.
 */

${htmlWebpackPlugin.files.js
  .concat(htmlWebpackPlugin.files.css)
  .map(file => {
    const parsedFile = path.parse(file);

    let name = parsedFile.name.replace(/-/g, '_').toUpperCase();

    if (mode === 'production') {
      const splitName = name.split('_');
      splitName.pop();
      name = splitName.join('_');
    }

    project = project === '.' ? path.basename(path.resolve('./')) : project;

    return `define( '${project.replace(/-/g, '_').toUpperCase()}_${name}_${parsedFile.ext
      .split('.')[1]
      .toUpperCase()}', '${parsedFile.base}' );
`;
  })
  .join(``)}
`;

module.exports = assetSettingsTemplate;
