/**
 * @file context
 * Created by Xinyi on 2019/2/12.
 */

import F2Err from './error'
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

        // assign default
        this._params = params = Object.assign({}, params, typeof opts.params === 'function' ? opts.params() : opts.params)

        // options
        const keyString = ['method', 'mode', 'cache', 'credentials', 'redirect', 'referrer', 'body']

        keyString.every(item => {
            if (opts[item]) {
                options[item] = opts[item]
            }
            return true
        })

        url = `${!/^https?/.test(url) && opts.prefix || ''}${url}`

        let element = document.createElement('a')
        element.setAttribute('href', url)

        // location
        this.location = element.href

        if (params && Object.keys(params).length) {
            url = `${element.href}?${paramsToString(params)}`
        }

        // body
        if (opts.body) {
            if (typeof opts.body === 'object') {
                if (headers.get('Content-Type') === 'multipart/form-data') {
                    options.body = (function (params) {
                        const fd = new FormData()
                        for (const key in params) {
                            if (/\[\]/m.test(key)) {
                                // example: upload multipart files
                                if (!(params[key] instanceof Array))
                                    params[key] = [params[key]]
                                const tempKey = key.replace('[]', '')
                                params[key].forEach(item => {
                                    fd.append(tempKey, item)
                                })
                            } else {
                                fd.append(key, params[key])
                            }
                        }
                        return fd
                    }(opts.body))
                    headers.delete('Content-Type')
                } else
                    options.body = JSON.stringify(opts.body)
            }
            else
                options.body = opts.body
        }

        if (typeof AbortController !== 'undefined') {
            const controller = opts.controller || new AbortController()
            options.signal = controller.signal
            this._controller = controller
        }

        // request
        request = new Request(url, options)

        this.request = arguments
        this._request = request
        this._headers = headers
        this._options = opts
        this._errors = []
    }

    get error() {
        return new F2Err(this._errors[this._errors.length - 1].message, this._errors)
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
