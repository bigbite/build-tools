const fs = require('fs');
const fsPath = require('path');
const validateOptions = require('./validate-options');

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
    constructor({
        verbose = false,
        initialCleanPaths = [],
        removeEmptyDirectories = true,
    }) {
        this.options = validateOptions({
            verbose,
            initialCleanPaths,
            removeEmptyDirectories,
        });

        this.initial = true;

        this.processFiles = this.processFiles.bind(this);
    }

    /**
     * @todo: Check the options being added and ensure defaults are set.
     * @todo: Look at whether emitters (watchRun and emit) can be combined.
     */
    apply(compiler) {
        const { hooks, options } = compiler;
        const { path } = options.output;

        this.path = path;

        // Run on each watch emitter when there are modified files.
        hooks.watchRun.tap('custom-simple-clean', (compilation) => {
            if(compilation.modifiedFiles) {
                const files = Array.from(compilation.modifiedFiles);
                this.processFiles(files);
            }
        });

        const cleanPaths = this.options.initialCleanPaths;

        /**
         * Run on each emit when initial is set to `true`.
         * - Initial should be changed to `false` after the first
         *   run to prevent consecutive runs.
         */
        hooks.emit.tap('custom-simple-clean', (compilation) => {
            if(this.initial) {
                const files = Array.from(compilation.assetsInfo.keys());
                this.processFiles([ ...cleanPaths, ...files ]);
            }
        });
    }

    /**
     * Process any passed files and/or directories for removal.
     * @param {array} files List of files and directories to process.
     */
    processFiles(files) {
        this.initial = false;

        files.forEach((file) => {
            // Bail early if the file does not exist.
            if(!fs.existsSync(file)) {
                return;
            }

            const fileStat = fs.lstatSync(file);

            // If target is a directory, remove it.
            if(fileStat.isDirectory()) {
                this.removeDirectory(file);
                return;
            }

            this.removeFile(file);
        });
    }

    /**
     * Remove any passed directory.
     * @param {string} dir Path to a directory to remove.
     */
    removeDirectory(dir) {
        fs.rmdirSync(dir, { recursive: true });
                
        output(`Dir: ${dir} deleted`);
    }

    /**
     * Remove any passed file.
     * @param {string} file Path to a file to remove.
     */
    removeFile(file) {
        fs.unlink(fsPath.resolve(`${this.path}/${file}`), (error) => {
            if (error) return;
            
            output(`File: ${file} deleted`);

            if(this.options.removeEmptyDirectories) {
                this.removeEmptyDirectory(file); 
            }
        });
    }

    /**
     * Remove any empty directory that a file belonged to.
     * @param {string} file Path to a file where the directory should be removed.
     */
    removeEmptyDirectory(file) {
        fs.readdir(fsPath.basename(`${this.path}/${file}`), (error, files) => {
            if(files && !files.length) {
                fs.rmSync(dir, { recursive: true, force: true });

                output(`Removed empty directory: ${dir}`);
            }
        });
    }

    /**
     * Output a given message when verbose option is `true`.
     * @param {string} message String to output.
     */
    output(message = '') {
        if(this.options.verbose) {
            console.log(message);
        }
    }
}

module.exports = SimpleClean;
