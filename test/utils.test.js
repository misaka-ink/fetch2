/**
 * @file (utils.test)
 * Created by xinyi on 2019-06-25.
 */

import {paramsToString} from '../lib/utils'

describe('utils', () => {
    test('cover params object to string', () => {
        const params = {
            a: 10,
            b: {
                c: 'd'
            }
        }
        const result = `a=10&b=${encodeURIComponent(JSON.stringify(params.b))}`
        return expect(paramsToString(params)).toEqual(result)
    })
})
