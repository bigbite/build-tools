const path = require('path');

/**
 * Project config holds all information about a particular project,
 * rather than directly pulling out paths from files or attempting
 * to build them, use what is here.
 */
module.exports = (
    packageObject = {
        name: '',
        json: {
            version: 'v0.0.0'
        },
        path: './'
    },
    mode = 'development',
    filteredEntrypoints = []
) => {
    return {
        name: packageObject?.name ?? '',
        version: packageObject?.json?.version ?? 'v0.0.0',
        paths: {
            dir: path.resolve(packageObject.path).replace(process.cwd(), ''),
            project: path.resolve(packageObject.path),
            config: path.resolve(`${__dirname}/../../configs`),
            src: path.resolve(`${packageObject.path}/src`),
            dist: path.resolve(`${packageObject.path}/dist`),
            clean: [
                path.resolve(`${packageObject.path}/dist/scripts`),
                path.resolve(`${packageObject.path}/dist/styles`),
                path.resolve(`${packageObject.path}/dist/static`),
            ],
            node_modules: path.resolve(packageObject.path, 'node_modules'),
        },
        clean: true,
        copy: true,
        mode,
        filteredEntrypoints,
    };
}