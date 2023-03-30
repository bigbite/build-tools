/**
 * Handles the output in the CLI for
 * webpack messages.
 */
class MessageError extends Error {
  constructor(message) {
    super(`Asset Message ${message}`);
    this.name = 'MessageError';
    this.stack = '';
  }
}

/**
 * Handles errors when messages are the incorrect type.
 */
class MessageTypeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MessageTypeError';
    this.stack = '';
  }
}

/**
 * Static file checks
 */
class AssetMessage {
  constructor(options) {
    this.targetDir = options.targetDir;
    this.handlers = options?.handlers || [];
  }

  /**
   * Apply the plugin to the current compiler.
   * 
   * @param {object} compiler - Webpack compiler.
   */
  apply(compiler) {
    compiler.hooks.compilation.tap('AssetMessage', (compilation) => {
      compilation.hooks.record.tap('AssetMessage', (comp) => {
        this.getMessages(this.handlers, [comp]);

        comp.assetsInfo.forEach((item) => {
          this.getMessages(this.handlers, [item, comp]);
        });
      });
    })
  }

  /**
   * Get the messages from the handlers and set in
   * compilation warnings.
   * 
   * @param {array} handlers - List of handler functions.
   * @param {array} data - List of data to pass through handler functions.
   */
  getMessages(handlers = [], data = []) {
    const [,compilation] = data;
    handlers.forEach((handlerFn) => {
      const handlerString = handlerFn(...data, this);

      if (!handlerString) {
        return;
      }

      if (typeof handlerString !== 'string') {
        throw new MessageTypeError('Expected message to be a string.');
      }

      compilation.warnings.push(
        new MessageError(handlerString)
      );
    });
  }
}

module.exports = AssetMessage;
