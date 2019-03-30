/**
 * @file webpack.dev
 * Created by Xinyi on 2019/2/12.
 */

const os = require('os')
const webpack = require('webpack')
const merge = require('webpack-merge')

const commonConf = require('./webpack.common.js')
const extensions = require('./extensions')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const PORT = 8080

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
            contentBase: extensions.commonPath.buildPath,
            compress: true,
            host: '0.0.0.0',
            public: `${IPv4}:${PORT}`,
            hot: true,
            disableHostCheck: true
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                title: extensions.packageInfo.projectName,
                meta: {
                    viewport: 'width=device-width, initial-scale=1, maximum-scale=1,'
                    + ' user-scalable=no, shrink-to-fit=no, viewport-fit=cover'
                }
            })
        ]
    }
)
