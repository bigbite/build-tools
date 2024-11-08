const TemplateGenerator = require('./custom/template-generator');
const assetSettingsTemplate = require('../templates/asset-settings');

module.exports = ({ mode, paths, name, version }) =>
  new TemplateGenerator({
    templates: [
      {
        filename: `${paths.project}/inc/asset-settings.php`,
        templateContent: (config, assetInfo) => assetSettingsTemplate(config, assetInfo, name, mode, version),
      },
    ],
  });
