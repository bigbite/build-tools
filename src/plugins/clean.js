const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = ({ clean, paths }) => {
    return clean &&
        new CleanWebpackPlugin({
            verbose: true,
            cleanOnceBeforeBuildPatterns: paths.clean,
            dangerouslyAllowCleanPatternsOutsideProject: true,
            dry: false,
        });
}
