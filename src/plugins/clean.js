const CustomSimpleClean = require('./custom/simple-clean');

module.exports = ({ clean, paths }) => {
    return clean &&
        new CustomSimpleClean({
            initialCleanPaths: paths.clean,
        });
}
