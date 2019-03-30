/**
 * @file utils
 * Created by Xinyi on 2019/2/12.
 */

/**
 * to string
 * @param {object} params
 * @return {string} query string
 */
export function paramsToString(params) {
    if (typeof params === 'object') {
        const paramArr = []
        for (const paramKey in params) {
            const paramValue = params[paramKey]
            if (typeof paramValue === 'object') {
                paramArr.push(
                    `${paramKey}=${encodeURIComponent(JSON.stringify(paramValue))}`
                )
            }
            else if (paramValue) {
                paramArr.push(
                    `${paramKey}=${encodeURIComponent(paramValue)}`
                )
            }
        }
        return paramArr.join('&')
    }
    else if (typeof params === 'string') {
        return params
    }
}

/**
 * koa-compose code
 * https://github.com/koajs/compose/blob/master/index.js
 * @param {Function} middleware
 * @return {Function}
 */
export function compose(middleware) {
    if (!Array.isArray(middleware)) {
        throw new TypeError('Middleware stack must be an array!')
    }
    for (const fn of middleware) {
        if (typeof fn !== 'function') {
            throw new TypeError('Middleware must be composed of functions!')
        }
    }
    return function (context, next) {
        // last called middleware #
        let index = -1
        return dispatch(0)
        function dispatch(i) {
            if (i <= index) {
                return Promise.reject(new Error('next() called multiple times'))
            }
            index = i
            let fn = middleware[i]
            if (i === middleware.length) {
                fn = next
            }
            if (!fn) {
                return Promise.resolve()
            }
            try {
                return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
            } catch (err) {
                // Todo: hook error middleware index;
                return Promise.reject(err)
            }
        }
    }
}
