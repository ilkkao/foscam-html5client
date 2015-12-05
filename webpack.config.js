const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    devtool: 'eval',
    entry: [
        // 'webpack-dev-server/client?http://localhost:3000',
        // 'webpack/hot/only-dev-server',
        './client/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'Foscam',
            template: path.join(__dirname, 'client/index.html'),
            inject: 'body'
        }),
        new webpack.ProvidePlugin({
            fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: [ 'react-hot', 'babel' ],
            include: path.join(__dirname, 'client')
        }, {
            test: /\.css$/,
            loader: 'style!css'
        }]
    }
};
