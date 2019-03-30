const express = require('express')
var multer  = require('multer')
var upload = multer({
    limits: { fieldSize: 25 * 1024 * 1024 }
}).single('file')

const app = express()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.post('/upload', (req, res) => {
    upload(req, res, function (err) {
        console.log(err)
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
        } else if (err) {
            // An unknown error occurred when uploading.
            // console.log(err)
        }

        // Everything went fine.

        console.log(req.body.name)

        res.status(200).end()
    })

})

module.exports = app
