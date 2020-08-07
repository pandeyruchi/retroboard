'use strict';

const request = require('supertest');

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false
});
const app = require('../src/app')(sequelize);
const Author = require('../src/author/model')(sequelize);
const Point = require('../src/points/model')(sequelize);

describe('API tests', () => {
    sequelize.sync()
    // before((done) => {
    //     sequelize.sync().then(Author.bulkCreate([{
    //             "name": "Tim Cook",
    //             "email": "timcook@gmail.com",
    //             "password": "pwd123"
    //         },
    //         {
    //             "name": "Han Brown",
    //             "email": "hanbrown@gmail.com",
    //             "password": "pwd123"
    //         },
    //         {
    //             "name": "Thomas Cook",
    //             "email": "thomascook@gmail.com",
    //             "password": "pwd123"
    //         },
    //         {
    //             "name": "Jhon kennedy",
    //             "email": "jk@gmail.com",
    //             "password": "pwd123"

    //         },
    //         {
    //             "name": "Maria Cook",
    //             "email": "mariacook@gmail.com",
    //             "password": "pwd123"
    //         }

    //     ]).then(done()));

    // });

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });


    describe('POST /signup', () => {
        it('should create author', (done) => {
            request(app)
                .post('/signup').send({
                    "name": "test",
                    "email": "test@gmail.com",
                    "password": "pwd123"
                })
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(201, done);
        });

        it('should faile to create author if required fields are not provided', (done) => {
            request(app)
                .post('/signup').send({
                    "name": "test",
                    "email": "test",
                    "password": "pwd123"
                })
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(400, done);
        });
    });

    describe('POST /login', () => {
        it('should login author with email and password', (done) => {
            request(app)
                .post('/login').send({
                    "email": "test@gmail.com",
                    "password": "pwd123"
                })
                .set('Content-Type', 'application/json')
                .expect(200, done);
        });

        it('should fail login author with incorrect email and password', (done) => {
            request(app)
                .post('/login').send({
                    "email": "test@gmail.com",
                    "password": "pwd1234"
                })
                .set('Content-Type', 'application/json')
                .expect(401, done);
        });
    });

    describe('POST /points', () => {
        it('should not create point without logged in author', (done) => {
            request(app)
                .post('/points').send({
                    "title": "sprint 1",
                    "description": "retro meeting",
                    "category": "Went well"
                })
                .set('Content-Type', 'application/json')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(401, done);
        });

        it('should not create point without a valid token', (done) => {
            request(app)
                .post('/points').send({
                    "title": "sprint 1",
                    "description": "retro meeting",
                    "category": "Went well"
                })
                .set("Authorization", `Bearer abcdxyz`)
                .set('Content-Type', 'application/json')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(401, done);
        });

        it('should create point with logged in author', (done) => {
            request(app)
                .post('/login').send({
                    "email": "test@gmail.com",
                    "password": "pwd123"
                })
                .set('Content-Type', 'application/json').then(res => {
                    request(app)
                        .post('/points').send({
                            "title": "sprint 1",
                            "description": "retro meeting",
                            "category": "Went well"
                        })
                        .set("Authorization", `Bearer ${res.text}`)
                        .set('Content-Type', 'application/json')
                        .expect('Content-Type', 'application/json; charset=utf-8')
                        .expect(200, done);
                })

        });

        it('should not create point with incorrect category', (done) => {
            request(app)
                .post('/login').send({
                    "email": "test@gmail.com",
                    "password": "pwd123"
                })
                .set('Content-Type', 'application/json').then(res => {
                    request(app)
                        .post('/points').send({
                            "title": "sprint 1",
                            "description": "retro meeting",
                            "category": "Went well123"
                        })
                        .set("Authorization", `Bearer ${res.text}`)
                        .set('Content-Type', 'application/json')
                        .expect('Content-Type', 'application/json; charset=utf-8')
                        .expect(400, done);
                })

        });
    });

    describe('PATCH /points', () => {
        it('should edit point with logged in author', (done) => {
            request(app)
                .post('/login').send({
                    "email": "test@gmail.com",
                    "password": "pwd123"
                })
                .set('Content-Type', 'application/json').then(res => {
                    request(app)
                        .patch('/points/1').send({
                            "title": "sprint 11"
                        })

                        .set("Authorization", `Bearer ${res.text}`)
                        .set('Content-Type', 'application/json')
                        .expect(function (res) {
                            delete res.body.createdAt
                            delete res.body.updatedAt
                        })
                        .expect(200, {
                            "author": "test@gmail.com",
                            "category": "Went well",
                            "description": "test@gmail.com",
                            "id": 1,
                            "title": "sprint 11"
                        }, done);
                })

        });

        it('should not edit point with incorrect id', (done) => {
            request(app)
                .post('/login').send({
                    "email": "test@gmail.com",
                    "password": "pwd123"
                })
                .set('Content-Type', 'application/json').then(res => {
                    request(app)
                        .patch('/points/10').send({
                            "title": "sprint 11"
                        })

                        .set("Authorization", `Bearer ${res.text}`)
                        .set('Content-Type', 'application/json')
                        .expect(function (res) {
                            delete res.body.createdAt
                            delete res.body.updatedAt
                        })
                        .expect(404, done);
                })

        });
    });

    describe('GET /points', () => {
        it('should return points', (done) => {
            request(app)
                .get('/points')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200, done);
        });


        it('should return points by category', (done) => {
            request(app)
                .get('/points?category="Went well"')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200, done);
        });
    });

    describe('GET /points/:id', () => {
        it('should return points by id', (done) => {
            request(app)
                .get('/points/1')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(200, done);
        });

        it('should not return point by id', (done) => {
            request(app)
                .get('/points/10')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(404, {
                    error_code: 'ENTITY_NOT_FOUND',
                    message: 'Entity with the above matching criterion not exist'
                }, done);
        });

        it('Should prevent sql injection', (done) => {
            request(app)
                .get('/points/1 OR 1=1')
                .expect('Content-Type', 'application/json; charset=utf-8')
                .expect(400, done);
        });
    });

    describe('DELETE /points', () => {
        it('should delete point with logged in author', (done) => {
            request(app)
                .post('/login').send({
                    "email": "test@gmail.com",
                    "password": "pwd123"
                })
                .set('Content-Type', 'application/json').then(res => {
                    request(app)
                        .delete('/points/1')
                        .set("Authorization", `Bearer ${res.text}`)
                        .expect(200, done);
                })
        });

        it('should not delete point with incorrect id', (done) => {
            request(app)
                .post('/login').send({
                    "email": "test@gmail.com",
                    "password": "pwd123"
                })
                .set('Content-Type', 'application/json').then(res => {
                    request(app)
                        .delete('/points/10')
                        .set("Authorization", `Bearer ${res.text}`)
                        .expect(404, done);
                })
        });
    });


});