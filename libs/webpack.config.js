var path = require('path');
var htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/index',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [{
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
            }, {
                test: /\.html$/,
                loader: 'html-loader'
            }, {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }],
    },
    plugins: [
        new htmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    devServer: {
        port: 8100,
        historyApiFallback: true
    }
};
//# sourceMappingURL=webpack.config.js.map