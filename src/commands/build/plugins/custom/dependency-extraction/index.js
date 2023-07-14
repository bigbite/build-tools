/**
 * External dependencies
 */
const path = require('path');
const webpack = require('webpack');
// In webpack 5 there is a `webpack.sources` field but for webpack 4 we have to fallback to the `webpack-sources` package.
const { RawSource } = webpack.sources || require('webpack-sources');
const isWebpack4 = webpack.version.startsWith('4.');
const { createHash } = webpack.util;

const WordPressDependencyExtraction = require('@wordpress/dependency-extraction-webpack-plugin');

global.DependencyExtraction = {};

class DependencyExtraction extends WordPressDependencyExtraction {
  constructor(options) {
    super(options);

    this.name = options?.name ?? 'project';
    this.customConfig = options?.customConfig ?? {};

    global.DependencyExtraction = {
      ...global.DependencyExtraction,
      [this.name]: {},
    };
  }

  externalizeWpDeps(_context, request, callback) {
    const externalKeys = Object.keys(this.customConfig?.externals);

    const hardDefaults = [
      '@wordpress/',
      '@babel/runtime/regenerator',
    ];

    if (
      !externalKeys.includes(request) &&
      !hardDefaults.some(item => request.startsWith(item))
    ) {
      return callback();
    }
  
    return super.externalizeWpDeps(_context, request, callback);
  }

  addAssets(compilation) {
    const {
      combineAssets,
      combinedOutputFile,
      externalizedReport,
      injectPolyfill,
      outputFormat,
      outputFilename,
    } = this.options;

    // Dump actually externalized dependencies to a report file.
    if (externalizedReport) {
      const externalizedReportFile =
        typeof externalizedReport === 'string'
          ? externalizedReport
          : defaultExternalizedReportFileName;
      compilation.emitAsset(
        externalizedReportFile,
        new RawSource(JSON.stringify(Array.from(this.externalizedDeps).sort())),
      );
    }

    const combinedAssetsData = {};

    // Accumulate all entrypoint chunks, some of them shared
    const entrypointChunks = new Set();
    for (const entrypoint of compilation.entrypoints.values()) {
      for (const chunk of entrypoint.chunks) {
        entrypointChunks.add(chunk);
      }
    }

    // Process each entrypoint chunk independently
    for (const chunk of entrypointChunks) {
      const chunkFiles = Array.from(chunk.files);

      const chunkJSFile = chunkFiles.find((f) => /\.js$/i.test(f));
      if (!chunkJSFile) {
        // There's no JS file in this chunk, no work for us. Typically a `style.css` from cache group.
        continue;
      }

      const chunkDeps = new Set();
      if (injectPolyfill) {
        chunkDeps.add('wp-polyfill');
      }

      const processModule = ({ userRequest }) => {
        if (this.externalizedDeps.has(userRequest)) {
          chunkDeps.add(this.mapRequestToDependency(userRequest));
        }
      };

      // Search for externalized modules in all chunks.
      const modulesIterable = isWebpack4
        ? chunk.modulesIterable
        : compilation.chunkGraph.getChunkModules(chunk);
      for (const chunkModule of modulesIterable) {
        processModule(chunkModule);
        // Loop through submodules of ConcatenatedModule.
        if (chunkModule.modules) {
          for (const concatModule of chunkModule.modules) {
            processModule(concatModule);
          }
        }
      }

      // Go through the assets and hash the sources. We can't just use
      // `chunk.contentHash` because that's not updated when
      // assets are minified. In practice the hash is updated by
      // `RealContentHashPlugin` after minification, but it only modifies
      // already-produced asset filenames and the updated hash is not
      // available to plugins.
      const { hashFunction, hashDigest, hashDigestLength } = compilation.outputOptions;

      const contentHash = chunkFiles
        .sort()
        .reduce((hash, filename) => {
          const asset = compilation.getAsset(filename);
          return hash.update(asset.source.buffer());
        }, createHash(hashFunction))
        .digest(hashDigest)
        .slice(0, hashDigestLength);

      const assetData = {
        // Get a sorted array so we can produce a stable, stringified representation.
        dependencies: Array.from(chunkDeps).sort(),
        version: contentHash,
      };

      if (combineAssets) {
        combinedAssetsData[chunkJSFile] = assetData;
        continue;
      }

      let assetFilename;
      if (outputFilename) {
        assetFilename = compilation.getPath(outputFilename, {
          chunk,
          filename: chunkJSFile,
          contentHash,
        });
      } else {
        assetFilename = compilation
          .getPath('[file]', { filename: chunkJSFile })
          .replace(/\.js$/i, '');
      }

      global.DependencyExtraction[this.name] = {
        ...global.DependencyExtraction[this.name],
        [assetFilename]: assetData,
      };
    }

    if (combineAssets) {
      const outputFolder = compilation.outputOptions.path;

      const assetsFilePath = path.resolve(
        outputFolder,
        combinedOutputFile || 'assets.' + (outputFormat === 'php' ? 'php' : 'json'),
      );
      const assetsFilename = path.relative(outputFolder, assetsFilePath);

      // Add source into compilation for webpack to output.
      compilation.assets[assetsFilename] = new RawSource(this.stringify(combinedAssetsData));
    }
  }
}

module.exports = DependencyExtraction;
