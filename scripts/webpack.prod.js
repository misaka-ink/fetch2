/**
 * @file webpack.prod
 * Created by Xinyi on 2019/2/12.
 */

const path = require('path')
const merge = require('webpack-merge')
const commonConf = require('./webpack.common.js')

// plugins
const CleanWebpackPlugin = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const distPath = path.resolve(__dirname, 'dist')


// webpack conf for prod
const conf = merge(
    commonConf, {
        mode: 'production',
        optimization: {
            nodeEnv: 'production',
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    cache: true,
                    terserOptions: {
                        output: {
                            comments: false
                        }
                    }
                })
            ]
        },
        output: {
            path: distPath,
            filename: 'fetch2.js',
            library: 'fetch2',
            libraryTarget: 'umd'
        },
        plugins: [
            new CleanWebpackPlugin(distPath)
        ]
    }
)

module.exports = conf
