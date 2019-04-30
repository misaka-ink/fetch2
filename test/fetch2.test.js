/**
 * @file fetch2.test
 * Created by Xinyi on 2019/2/13.
 */

const fs = require('fs')

import app from './server'
import fetch2, {method} from '../lib'

const f2 = fetch2.getInstance({
    params: () => {
        return {t: Date.now()}
    }
})

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
    test('make a get request should return `Hello World!`', async () => {
        try {
            const result = await f2.request('http://localhost:3000/get', {
                msg: 'Hello World!'
            })
            return expect(result.msg).toEqual('Hello World!')
        } catch (e) {
            throw e
        }
    })

    test('make a request should return `request timeout` error', async () => {
        try {
            const result = await f2.request('http://localhost:3000/timeout')
        } catch (e) {
            return expect(e.message).toEqual('request timeout')
        }
    })

    test('should abort request after 2 seconds', async () => {
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

    test('make a get request with parameters should return passing msg', async () => {
        try {
            const test = {
                msg: 'Hello World 233!'
            }

            const result = await f2.request('http://localhost:3000/get', test)
            return expect(result.msg).toEqual(test.msg)
        } catch (e) {
            throw e
        }
    })

    test('make a post request should return reverse msg', async () => {
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

    test('make a post request with a image', async () => {
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

    test('make a put request', async () => {
        try {
            return f2.request('http://localhost:3000/put', {}, {
                method: method.PUT
            })
        } catch (e) {
            throw e
        }
    })

    test('make a del request', async () => {
        try {
            return f2.request('http://localhost:3000/delete', {}, {
                method: method.DELETE
            })
        } catch (e) {
            throw e
        }
    })

    test('retry a request after the 404 error (two request', async () => {
        const count = 2
        try {
            const result =  await f2.request('http://localhost:3000/404', {}, {
                count
            })
        }
        catch (e) {
            return expect(e.message.split('|').length).toEqual(count)
        }
    })

    test('apply default parameters', async () => {
        const result = await f2.request('http://localhost:3000/get')
        return expect(!!result.t).toBe(true)
    })
})
