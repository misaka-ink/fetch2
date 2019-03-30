/**
 * @file commonPath.js
 * Created by Blaite on 2018/11/5.
 */

const path = require('path')
const pkgInfo = require('./packageInfo')
const currentPath = process.cwd()
const staticPath = path.join('static', pkgInfo.projectName)

module.exports = {
    rootPath: currentPath,
    modulesPathMatch: /(node_modules|bower_compontents)/,
    buildPath: path.join(currentPath, 'build'),
    pkgPath: path.join(currentPath, 'package.json'),
    htmlPath: path.join('static', 'page'),
    static: {
        path: staticPath,
        cssPath: path.join(staticPath, 'css'),
        jsPath: path.join(staticPath, 'js'),
        assetsPath: path.join(staticPath, 'assets')
    }
}
