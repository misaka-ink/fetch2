/**
 * @file (error)
 * Created by xinyi on 2019-06-25.
 */

/**
 * Fetch2 error extend Error
 * @param {string} message - error message
 * @param {*} data - pass
 * @constructor
 */
export default function FetchError(message = 'Fetch2 warning!', data) {
    this.name = 'FetchError'
    this.message = message
    this.stack = (new Error()).stack
    this.info = Object.assign(data instanceof Array ? [] : {}, data)
}

FetchError.prototype = new Error
