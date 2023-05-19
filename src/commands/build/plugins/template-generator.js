const TemplateGenerator = require('./custom/template-generator');
const assetSettingsTemplate = require('../templates/asset-settings');

module.exports = ({ mode, paths, name, version }) =>
  new TemplateGenerator({
    templates: [
      {
        filename: `${paths.project}/inc/asset-settings.php`,
        templateContent: (config) => assetSettingsTemplate(config, name, mode, version),
      },
    ],
  });
