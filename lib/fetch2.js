/**
 * @file fetch2
 * Created by Xinyi on 2019/2/12.
 */

import 'whatwg-fetch'
import method from './method'
import Context from './context'
import {compose} from './utils'
import F2Err from './error'

export default class fetch2 {
    /**
     * get an instance or create a new instance
     * @param {object} args
     * @returns {fetch2}
     */
    static getInstance(args) {
        if (!this.instance) {
            this.instance = new this(args)
        }
        return this.instance
    }

    /**
     * initialization Fetch2 instance
     * @param {object} opts
     */
    constructor(opts) {
        // default options
        const defaultOptions = {
            method: method.GET,
            credentials: 'same-origin',
            redirect: 'follow',
            mode: 'cors',
            referrer: 'no-referrer',
            cache: 'no-cache',
            timeout: 3000,
            count: 0,
            params: undefined
        }

        // total options
        this.options = Object.assign({}, defaultOptions, opts)

        // middlewares
        this.middlewares = []
    }

    /**
     * initiate a request
     * @param url {string} url request target path
     * @param params {object} params request data
     * @param opts {object} opts request args
     * @returns {Promise}
     */
    request(url, params = {}, opts) {
        const fn = compose(this.middlewares.concat(this.fetch()))
        if (arguments.length === 1 && url instanceof Context) {
            return this.handleRequest(url, fn)
        }
        const ctx = new Context({url, params, opts: Object.assign({}, this.options, opts)})
        return this.handleRequest(ctx, fn)
    }

    /**
     * wrapper request and processing response
     * @param ctx
     * @param fn
     * @returns {Promise<T | never>}
     */
    handleRequest(ctx, fn) {
        return fn(ctx)
            .then(response => {
                if (!ctx) throw response
                return this.handleResponse(ctx.response)
            })
            .catch(this.handleError.bind(this, ctx))
    }

    /**
     * retrieve data
     * @returns {Function}
     */
    fetch() {
        return ctx => {
            const fetchPromise = fetch(ctx._request)
                .then(response => {
                    ctx._response = response
                    if (response.ok) {
                        const contentType = response.headers.get("content-type")
                        if (contentType && contentType.indexOf("application/json") !== -1) {
                            return response.json()
                        } else {
                            return response.text()
                        }
                    } else {
                        // return response for middleware processing
                        ctx.response = response
                        return response.text().then(body => {
                            throw new F2Err(response.statusText, body, response)
                        })
                    }
                })
                .then(result => {
                    ctx.response = result
                    return result
                })

            ctx.incrementNum()

            if (ctx._options.timeout) {
                return Promise.race([
                    fetchPromise,
                    new Promise((resolve, reject) =>
                        setTimeout(() => {
                            ctx._controller && ctx._controller.abort()
                            reject('request timeout')
                        }, ctx._options.timeout)
                    )
                ])
            } else
                // todo: make test
                return fetchPromise
        }
    }

    /**
     * wrapper response
     * @param {*} response handle object
     * @returns {*}
     */
    handleResponse(response) {
        return response
    }

    /**
     * wrapper error response
     * @param {*} err error msg or object
     */
    handleError(ctx, err) {
        if (typeof err === 'string')
            ctx.error = new F2Err(err)
        else
            ctx.error = err
        if (ctx.num < ctx._options.count) {
            return this.request(ctx)
        }
        throw ctx.error
    }

    /**
     * use middleware
     * @param {Function} middleware
     * @returns {fetch2}
     */
    use(middleware) {
        if (typeof middleware !== 'function') {
            throw new Error('middleware must be a function!')
        }
        this.middlewares.push(middleware)
        return this
    }
}
