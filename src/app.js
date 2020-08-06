'use strict'

const express = require('express')
const app = express()

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
app.use(jsonParser);
module.exports = (db) => {
   
    app.get('/health', (req, res) => res.send('Healthy'))

    require('./author/route')(app,db,logger);

    return app
}