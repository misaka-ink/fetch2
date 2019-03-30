/**
 * @file webpack.common
 * Created by Xinyi on 2019/2/12.
 */

const extensions = require('./extensions')

module.exports = {
    entry: extensions.packageInfo.entry,
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: extensions.commonPath.modulesPathMatch,
                loader: 'babel-loader'
            }
        ]
    }
}
