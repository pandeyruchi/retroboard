'use strict'

const express = require('express')
const app = express()
const {generateToken} = require('./auth')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const logger = require('../logger')(module)

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const logRequest = (req, res, next) => {

    res.on('finish', () => {
        let msg = `${req.method} ${req.originalUrl} ${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`;

        if (res.statusCode >= 200 && res.statusCode < 400) {
            logger.info(msg);
        } else {
            logger.error(msg);
        }
    })
    next()
}
app.use(logRequest);

module.exports = (db) => {
    const Author = require('./author/model')(db);

    app.get('/health', (req, res) => res.send('Healthy'))

    app.post('/signup', jsonParser, async (req, res) => {

        try {

            let author = await Author.create(req.body);           
            logger.info('Author created successfully' + JSON.stringify(author));
            res.status(200).send(author);
        } catch (err) {
            logger.error(err);
            return res.status(400).send({
                error_code: 'AUTHOR_NOT_CREATED_ERROR',
                message: 'Invalid request'
            })
        }
    })

    app.post('/login', jsonParser, async (req, res) => {
        try {
            let author = await Author.findByPk(req.body.email)
            if (!!author && author.isCorrectPassword(req.body.password))
                res.send(generateToken(author));
            else
                res.status(400).send({
                    'error_code': 'AUTHOR_NOT_FOUND_ERROR',
                    'message': 'Could not find any author'
                });
        } catch (err) {
            logger.error(err);
            res.status(500).send({
                error_code: "SERVER ERROR",
                message: "Internal Server Error"
            });
        }

    })
   
    return app
}