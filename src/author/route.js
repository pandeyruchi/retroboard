const {
    generateToken
} = require('../auth')
module.exports = (app, db, logger) => {
    const Author = require('./model')(db);

    app.post('/signup', async (req, res) => {
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

    app.post('/login', async (req, res) => {
        try {
            let author = await Author.findByPk(req.body.email)
            if (!!author && author.isCorrectPassword(req.body.password))
                res.send(generateToken(author));
            else
                res.status(404).send({
                    'error_code': 'AUTHOR_ID_PASSWORD_ERROR',
                    'message': 'Author not found with given ID and Password'
                });
        } catch (err) {
            logger.error(err);
            res.status(500).send({
                error_code: "SERVER ERROR",
                message: "Internal Server Error"
            });
        }
    })
}