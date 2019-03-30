/**
 * @file packageInfo
 * Created by Blaite on 2018/11/5.
 */
const packageInfo = require(`${process.cwd()}/package.json`)
module.exports = {
    version: packageInfo.version || '1.0.0',
    projectName: packageInfo.name || '',
    projectTitle: packageInfo.title || '',
    entry: packageInfo.main || './index.js'
}
