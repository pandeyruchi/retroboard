const {
    generateToken
} = require('../auth')
const {
    handleBadRequest,
    handleUnauthorized
} = require('../error')
module.exports = (app, Author, logger) => {

    app.post('/signup', async (req, res) => {
        try {
            let author = await Author.create(req.body)
            logger.info('Author created successfully' + JSON.stringify(author))
            res.status(201).send(author)
        } catch (err) {
            logger.error(err)
            handleBadRequest(res)
        }
    })

    app.post('/login', async (req, res) => {

        let author = await Author.findByPk(req.body.email)
        if (!!author && author.isCorrectPassword(req.body.password)) {
            let token = generateToken(author)
            res.status(200).send(token)
        } else
            handleUnauthorized(res)

    })


}