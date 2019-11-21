/**
 * @file (fetch2.test)
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

        const result = await f2.request('http://localhost:3000/post', {}, {
            body: test,
            method: method.POST
        })

        return expect(result).toEqual({
            msg: test.msg.split('').reverse().join('')
        })
    })

    test('make a post request with a image', async () => {
        const img = fs.readFileSync('./test/upload.png')

        try {
            const result = await f2.request('http://localhost:3000/upload', {
                name: 'haha'
            }, {
                body: {
                    file: new File([img], 'i.png')
                },
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

    test('make a post request with multipart images', async () => {
        const img = fs.readFileSync('./test/upload.png')
        const file1 = new File([img], 'i1.png')
        const file2 = new File([img], 'i2.png')

        try {
            const result = await f2.request('http://localhost:3000/upload', {
                name: 'haha'
            }, {
                body: {
                    'file[]': [file1, file2]
                },
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

    test('apply default parameters', async () => {
        const result = await f2.request('http://localhost:3000/get')
        return expect(!!result.t).toBe(true)
    })

    test('retry a request after the 404 error (two request', async () => {
        const count = 2
        try {
            const result =  await f2.request('http://localhost:3000/404', {}, {
                count
            })
        }
        catch (err) {
            return expect(err.info.length === count).toBe(true)
        }
    })

    test('error feedback', async () => {
        try {
            const result = await f2.request('http://localhost:3000/error')
            return false
        }
        catch (err) {
            return expect(err instanceof Error).toBe(true)
        }
    })

    test('make a request of GET method with number zero params', async () => {
        try {
            const result = await f2.request('http://localhost:3000/zero', {
                zero: 0
            })
            expect(result.msg).toBe('ok')
        }
        catch (err) {
            throw err
        }
    })

    test('get 500 error message', async () => {
        try {
            const result = await f2.request('http://localhost:3000/500')
        }
        catch (err) {
            expect(err.info).toHaveLength(1)
            const errorInfoStr = err.info[0].info
            const errorInfoObj = JSON.parse(errorInfoStr)
            expect(errorInfoObj.error).toBe('something blew up')
        }
    })
})
