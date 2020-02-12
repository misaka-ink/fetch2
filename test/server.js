/**
 * @file server
 * Created by Xinyi on 2019/2/13.
 */

const fs = require('fs')

!fs.existsSync('test/temp') && fs.mkdirSync('test/temp')

const express = require('express')
const app = express()
const multiparty = require('multiparty')

const bodyParser = require('body-parser')

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({extended: true}))

app.get('/get', (req, res) => {
    if (Object.keys(req.query).length > 0) {
        res.send(req.query)
    } else {
        res.json({
            msg: 'Hello World!'
        })
    }
})

app.get('/timeout', (req, res) => {
    setTimeout(() => {
        if (Object.keys(req.query).length) {
            res.send(req.query)
        } else {
            res.json({
                msg: 'Hello World!'
            })
        }
    }, 5000)
})

app.post('/post', (req, res) => {
    if (Object.keys(req.body).length) {
        res.json({
            msg: req.body.msg.split('').reverse().join('')
        })
    } else {
        res.json({
            msg: 'Hello World!'
        })
    }
})

app.post('/upload', (req, res) => {
    const form = new multiparty.Form()
    form.parse(req, function (err, fields, files) {
        Promise.all(
            files.file.map((file, index) => {
                new Promise((resolve, reject) => {
                    fs.readFile(file.path, (err, data) => {
                        if (err) reject(err)
                        fs.writeFile(`./test/temp/upload_${file.originalFilename}`, data, 'binary', err => {
                            !err ? resolve() : reject(err)
                        })
                    })
                })
            })
        )
            .then(result => res.status(200).end())
            .catch(err => res.status(500).end())
    })
})

app.put('/put', (req, res) => {
    if (Object.keys(req.body).length) {
        res.status(204).end()
    } else {
        res.json({
            msg: 'Hello World!'
        })
    }
})

app.delete('/delete', (req, res) => {
    if (Object.keys(req.body).length) {
        res.status(201).end()
    } else {
        res.json({
            msg: 'Hello World!'
        })
    }
})

app.get('/zero', (req, res) => {
    if (+req.query.zero === 0) {
        res.json({
            msg: 'ok'
        })
    }
})

app.get('/200', (req, res) => {
    res.status(200).end()
})

app.get('/500', (req, res) => {
    res.status(500).send({ error: 'something blew up' })
})

module.exports = app

if (!module.parent) {
    app.listen(3000)
}
