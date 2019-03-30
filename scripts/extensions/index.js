/**
 * @file index
 * Created by Blaite on 2018/11/5.
 */

const path = require('path')

exports.commonPath = require('./commonPath')
exports.packageInfo = require('./packageInfo')
exports.commonUrl = require('./commonUrl')
exports.withPath = (...paths) => {
    return path.join.apply(null, paths)
}
