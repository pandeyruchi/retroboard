const {
    authenticate
} = require('../auth')
const {
    handleNotFound,
    handleBadRequest
} = require('../error')

module.exports = (app, Point, logger) => {
    app.post('/points', authenticate, async (req, res) => {
        try {
            req.body.author = req.user.email
            console.log(req.body)
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
            limit: Number(req.query.limit) || 25
        }
        if (req.query.category) {
            queryParams.where = {
                category: req.query.category
            }
        }

        let points = await Point.findAll(queryParams)
        res.send(points)

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
            handleBadRequest(res, err)
        }
    })

    app.patch('/points/:id', authenticate, async (req, res) => {

        let point = await Point.findByPk(Number(req.params.id))
        if (!point) {
            return handleNotFound(res)
        }
        point.title = req.body.title || point.title
        point.description = req.body.description || point.description
        point.category = req.body.category || point.category
        await point.save()
        res.status(200).send(point)
    })

    app.delete('/points/:id', authenticate, async (req, res) => {
        let point = await Point.findByPk(Number(req.params.id))
        console.log(point)
        if (point) {
            await point.destroy()
            res.status(200).send()
        } else {
            handleNotFound(res)
        }
    })
}