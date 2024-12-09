const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //     template: './src/popup.html',
        //     filename: 'popup.html',
        //     inject: false
        // }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'images', to: 'images' }, 
                { from: 'src/popup.html', to: 'popup.html' },
                { from: 'manifest.json', to: 'manifest.json' }
            ]
        })
    ],
    mode: 'development'
};