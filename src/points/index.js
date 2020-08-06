const {
    generateToken
} = require('../auth')
const {
    handleServerError,
    handleNotFound,
    handleBadRequest
} = require('../error')
const jsonPatch = require('fast-json-patch')
module.exports = (app, db, logger) => {
    const Point = require('./model')(db)

    const handleEntityNotFound = function (res) {
        return res.status(404).send({})
    }

    app.post('/points', async (req, res) => {
        try {
            let point = await Point.create(req.body)
            logger.info('Point created successfully' + JSON.stringify(point))
            res.status(200).send(point)
        } catch (err) {
            logger.error(err)
            handleBadRequest(res)
        }
    })



    app.get('/points', async (req, res) => {
        let queryParams = {
            offset: Number(req.query.offset) || 0,
            limit: Number(req.query.limit) || 100
        }
        try {
            let points = await Point.findAll(queryParams)
            res.send(points)
        } catch (err) {
            logger.error(err)
            handleServerError(err)
        }
    })

    app.get('/points/:id', async (req, res) => {
        try {
            let point = await Point.findByPk(Number(req.params.id))
            if (point)
                res.send(point)
            else
                handleNotFound(res)
        } catch (err) {
            logger.error(err)
            handleServerError(res)
        }
    })

    app.patch('/points/:id', async (req, res) => {
        try {
            let point = await Point.findByPk(Number(req.params.id))
            if (point) {
                point.title = req.body.title || point.title
                point.description = req.body.description || point.description
                point.category = req.body.category || point.category
                await point.save()
                res.status(200).send()
            } else {
                handleNotFound(res)
            }
        } catch (err) {
            logger.error(err)
            handleServerError(res)

        }
    })
}