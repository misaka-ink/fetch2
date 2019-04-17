/**
 * @file fetch2.test
 * Created by Xinyi on 2019/2/13.
 */

const fs = require('fs')

import app from './server'
import fetch2, {method} from '../lib'

const f2 = fetch2.getInstance()

let server

beforeAll(async done => {
    server = await app.listen(3000)
    done()
})

afterAll(async done => {
    await server.close()
    done()
})

describe('Fetch2', () => {
    test('initiate a get request', async () => {
        try {
            const test = {
                msg: 'Hello World!'
            }

            const result = await f2.request('http://localhost:3000/get')
            return expect(result).toEqual(test)
        } catch (e) {
            throw e
        }
    })

    test('get request return timeout', async () => {
        try {
            const result = await f2.request('http://localhost:3000/timeout')
        } catch (e) {
            return expect(e.message).toEqual('request timeout')
        }
    })

    test('abort request after 2 seconds', async () => {
        try {
            const controller = new AbortController()
            setTimeout(() => {
                controller.abort()
            }, 2000)
            const result = await f2.request('http://localhost:3000/timeout', null, {
                controller
            })
        } catch (e) {
            return !expect(e.message).toEqual('Aborted')
        }
    })

    test('initiate a get request with parameters', async () => {
        try {
            const test = {
                msg: 'Hello World 233!'
            }

            const result = await f2.request('http://localhost:3000/get', test)
            return expect(result).toEqual(test)
        } catch (e) {
            throw e
        }
    })

    test('initiate a post request with parameters', async () => {
        const test = {
            msg: 'Hi'
        }

        const result = await f2.request('http://localhost:3000/post', test, {
            method: method.POST
        })

        return expect(result).toEqual({
            msg: test.msg.split('').reverse().join('')
        })
    })

    test('initiate a post request with a file', async () => {
        const img = await fs.readFileSync('./test/upload.png', {encoding: 'binary'})

        try {
            const result = await f2.request('http://localhost:3000/upload', {
                file: img,
                name: 'haha'
            }, {
                method: method.POST,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 5000
            })

            return result
        } catch (e) {
            throw e
        }
    })

    test('initiate a put request', async () => {
        try {
            return await f2.request('http://localhost:3000/put', {}, {
                method: method.PUT
            })
        } catch (e) {
            throw e
        }
    })

    test('initiate a del request', async () => {
        try {
            return await f2.request('http://localhost:3000/delete', {}, {
                method: method.DELETE
            })
        } catch (e) {
            throw e
        }
    })
})
