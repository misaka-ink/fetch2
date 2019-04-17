/**
 * @file context
 * Created by Xinyi on 2019/2/12.
 */

import method from './method'
import {paramsToString} from './utils'

export default class Context {
    /**
     * initialize a new context.
     * @param url
     * @param params
     * @param opts
     */
    constructor({url, params, opts}) {
        let request, headers, options = {}

        // initial
        this.__conf = {
            number: 0
        }

        // headers
        options.headers = headers = new Headers(Object.assign({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }, opts.headers))

        // options
        const keyString = ['method', 'mode', 'cache', 'credentials', 'redirect', 'referrer', 'body']

        keyString.every(item => {
            if (opts[item]) {
                options[item] = opts[item]
            }
            return true
        })

        const controller = opts.controller || new AbortController()
        options.signal = controller.signal

        url = `${opts.prefix || ''}${url}`

        if (params && options.method === method.GET && Object.keys(params).length) {
            url = `${url}?${paramsToString(params)}`
        }

        // body
        if (params && !options.body && options.method !== method.GET) {
            if (headers.get('Content-Type') === 'multipart/form-data') {
                options.body = (function (params) {
                    const fd = new FormData()
                    for (const key in params) {
                        fd.append(key, params[key])
                    }
                    return fd
                }(params))
                headers.set('Content-Type', 'application/x-www-form-urlencoded')
            } else
                options.body = JSON.stringify(params)
        }

        // request
        request = new Request(url, options)

        this.request = arguments
        this._request = request
        this._headers = headers
        this._controller = controller
        this._options = opts
        this._errors = []
    }

    get errors() {
        return this._errors
    }

    set error(error) {
        this._errors.push(error)
    }

    get num() {
        return this.__conf.number
    }

    incrementNum() {
        this.__conf.number++
    }
}
