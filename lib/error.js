/**
 * @file (error)
 * Created by xinyi on 2019-06-25.
 */

/**
 * Fetch2 error extend Error
 * @param {string} message - error message
 * @param {*} data - pass
 * @param {*} response - response obj
 * @constructor
 */
export default function FetchError(message = 'Fetch2 warning!', data, response) {
    this.name = 'FetchError'
    this.message = message
    this.stack = (new Error()).stack
    this.info = data
    this.response = response
}

FetchError.prototype = new Error
