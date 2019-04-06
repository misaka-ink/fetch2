/**
 * @file webpack.dev
 * Created by Xinyi on 2019/2/12.
 */

const os = require('os')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConf = require('./webpack.common.js')

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')

// conf
const PORT = 8080
const currentPaht = process.cwd()
const packageInfo = require(path.join(currentPaht, 'package.json'))

let IPv4
for (let i = 0; i < os.networkInterfaces().en0.length; i++) {
    if (os.networkInterfaces().en0[i].family === 'IPv4') {
        IPv4 = os.networkInterfaces().en0[i].address
    }
}

module.exports = merge(
    commonConf, {
        mode: 'development',
        devServer: {
            contentBase: path.join(currentPaht, 'build'),
            compress: true,
            host: '0.0.0.0',
            public: `${IPv4}:${PORT}`,
            hot: true,
            disableHostCheck: true
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                title: packageInfo.name || '',
                meta: {
                    viewport: 'width=device-width, initial-scale=1, maximum-scale=1,'
                    + ' user-scalable=no, shrink-to-fit=no, viewport-fit=cover'
                }
            })
        ]
    }
)
