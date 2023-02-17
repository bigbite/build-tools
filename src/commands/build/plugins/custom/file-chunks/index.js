const fs = require('fs');

/**
 * External dependencies
 */

class FileChunks {
  constructor(options) {
    this.targetDir = options.targetDir;
    this.handlers = options.handlers;
  }

  apply(compiler) {
    const logger = compiler.getInfrastructureLogger('Static Files');

    compiler.hooks.afterEmit.tap('FileChunks', (compilation) => {
      const modules = [];
      compilation.chunks.forEach((chunk) => {
        chunk.getModules().forEach((module) => {
          modules.push(module);
        });
      });

      console.log(compilation.addModule('example.js'));

      const assets = Array.from(compilation.fileDependencies.values());
      const files = this.getChunks(assets);

      process.stdout.write('\n\n');

      for (let i = 0; i < files.length; i++) {
        const { messages } = files[i];
        for (let m = 0; m < messages.length; m++) {
          // compilation.reportDependencyErrorsAndWarnings(files[i].name);
          logger.warn(messages[m]);
        }
      }

      process.stdout.write('\n');
    });

    compiler.hooks.shutdown.tap('FileChunks', () => {
      console.log('SHUTDOWN');
    });
  }

  getChunks(chunks) {
    const files = chunks.map((file) => ({
      name: file,
      messages: [],
    }));

    for (let i = 0; i < files.length; i++) {
      this.handlers.map((handler) => {
        files[i] = handler(files[i]);
      });
    }

    return files;
  }
}

module.exports = FileChunks;
