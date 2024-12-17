const fs = require('fs');
const { dirname } = require('path');

/**
 * External dependencies
 */

class TemplateGenerator {
  constructor({ templates = [] }) {
    this.templates = templates;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap(this.constructor.name, this.createTemplates.bind(this));
  }

  createTemplates(compilation) {
    let files = [];
    this.templates.forEach(({ filename, templateContent }) => {
      const assetsInfo = compilation.assetsInfo;
      for (const entrypoint of compilation.entrypoints.values()) {
        for (const chunk of entrypoint.chunks) {
          files = [...files, ...chunk.files];
        }
      }

      const templateString = templateContent(files, assetsInfo);

      try {
        fs.mkdir(dirname(filename), { recursive: true }, (err) => {
          if (err) {
            throw new Error(err);
          }

          fs.writeFileSync(filename, templateString);
        });
      } catch (err) {
        console.log(err);
      }
    });
  }
}

module.exports = TemplateGenerator;
