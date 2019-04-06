/**
 * @file webpack.common
 * Created by Xinyi on 2019/2/12.
 */

module.exports = {
    entry: './lib/index.js',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
}
