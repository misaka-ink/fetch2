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
const distPath = path.resolve(process.cwd(), 'dist')

// webpack conf for prod
const conf = merge(
    commonConf, {
        entry: {
            'fetch2': './lib/index.js',
            'fetch2.min': './lib/index.js'
        },
        mode: 'production',
        optimization: {
            nodeEnv: 'production',
            minimizer: [
                new TerserPlugin({
                    test: /\.min/i,
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
            filename: '[name].js',
            library: '[name]',
            libraryTarget: 'umd'
        },
        plugins: [
            new CleanWebpackPlugin({})
        ]
    }
)

module.exports = conf
