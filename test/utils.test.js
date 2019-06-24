/**
 * @file (utils.test)
 * Created by xinyi on 2019-06-25.
 */

import {paramsToString} from '../lib/utils'

describe('Utils lib', () => {
    test('cover object to url string', () => {
        const params = {
            a: 10,
            b: {
                c: 'd'
            }
        }
        const result = `a=10&b=${encodeURIComponent(JSON.stringify(params.b))}`
        return expect(paramsToString(params)).toEqual(result)
    })

    test('use directly when the argument is a string', () => {
        const params = 'hello world'
        return expect(paramsToString(params)).toEqual(params)
    })

    test('throw wrong parameter when type error', () => {
        const params = new Function()
        return expect(() => paramsToString(params)).toThrow()
    })
})
