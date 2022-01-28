const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = ({ mode }) => {
    // Extract CSS to own bundle, filename relative to output.path.
    return new MiniCssExtractPlugin({
        filename: () => {
            return mode === 'production' ? '../styles/[name]-[contenthash:8].css' : '../styles/[name].css';
        },
        chunkFilename: '[name].css',
    });
}
