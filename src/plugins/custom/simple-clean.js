const fs = require('fs');
const fsPath = require('path');

/**
 * Custom plugin for simple cleaning of directories.
 * 
 * Cleans all files designated for build targets, such as distributables
 * and assets. Completely cleans these files on initial build in watch mode
 * then handles files on a case-by-case basis there after.
 */
class SimpleClean {
    
    /**
     * Instantiate the SimpleCLean class, to be passed to
     * webpack under plugins.
     * 
     * @param {object} options - The list of set options by the user.
     * @param {array} options.initialCleanPaths - Array of paths to clean on the first run. 
     * Directories will be recursively and all files within will be deleted.
     * @param {boolean} options.verbose - Whether sets and output should be made when running.
     */
    constructor(options = {}) {
        this.options = options;

        this.initial = true;

        this.removeFiles = this.removeFiles.bind(this);
    }

    /**
     * @todo: Check the options being added and ensure defaults are set.
     * @todo: Look at whether emitters (watchRun and emit) can be combined.
     */
    apply(compiler) {
        const { hooks, options } = compiler;
        const { path } = options.output;

        this.path = path;

        const cleanPaths = this.options.initialCleanPaths;

        // Run on each watch emitter when there are modified files.
        hooks.watchRun.tap('custom-simple-clean', (compilation) => {
            if(compilation.modifiedFiles) {
                const files = Array.from(compilation.modifiedFiles);
                this.removeFiles(files);
            }
        });

        /**
         * Run on each emit when initial is set to `true`.
         * - Initial should be changed to `false` after the first
         *   run to prevent consecutive runs.
         */
        hooks.emit.tap('custom-simple-clean', (compilation) => {
            if(this.initial) {
                const files = Array.from(compilation.assetsInfo.keys());
                this.removeFiles([ ...cleanPaths, ...files ]);
            }
        });
    }

    removeFiles(files) {
        this.initial = false;

        files.forEach((file) => {
            if(!fs.existsSync(file)) {
                return;
            }

            const fileStat = fs.lstatSync(file);

            if(fileStat.isDirectory()) {
                fs.rmdirSync(file, { recursive: true });
                
                if(this.options.verbose) {
                    console.log(`Dir: ${file} deleted`);
                }
                return;
            }

            fs.unlink(fsPath.resolve(`${this.path}/${file}`), (error) => {
                if (error) return;
                
                if(this.options.verbose) {
                    console.log(`File: ${file} deleted`);
                }

                fs.readdir(fsPath.basename(`${this.path}/${file}`), (error, files) => {
                    if(files && !files.length) {
                        fs.rmSync(dir, { recursive: true, force: true });
                    }
                });
            });
        });
    }
}

module.exports = SimpleClean;
