const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nconf = require('nconf');

nconf.argv().env().file({ file: 'config.json' });

module.exports = {
    devtool: 'cheap-source-map',
    entry: './client/index',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'Foscam',
            template: path.join(__dirname, 'client/index.html'),
            inject: 'body',
            appTitle: nconf.get('page_title'),
            appSettings : JSON.stringify({
                socketIoPort: nconf.get('socket_io_client_port'),
                enableWebPassword: nconf.get('enable_web_password'),
                locale: nconf.get('locale'),
                pageTitle: nconf.get('page_title'),
                imageTakenLabel: nconf.get('image_taken_label'),
                passwordLabel: nconf.get('password_label'),
                loginLabel: nconf.get('login_label'),
                logoutLabel: nconf.get('logout_label')
            })
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
    },
    devServer: {
        entry: [
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server',
            './client/index'
        ],

        proxy: {
            '/api/*': {
                target: 'http://localhost:3000'
            }
        },
        stats: {
            colors: true,
            chunks: false
        }
    }
};
