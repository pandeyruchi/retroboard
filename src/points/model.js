const Sequelize = require('sequelize')


module.exports = (sequelize) => {
    const Point = sequelize.define('points', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'title',
            validate: {
                notEmpty: {
                    msg: "Title must be a non empty string"
                },
                notNull: {
                    msg: "Title must be a non empty string"
                }
            }
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'description'
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'description'
        },
        category: {
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['Went well', "Didn't go well", "Need to improve", "extras"],
            validate: {
                isIn: {
                    args: [
                        ['Went well', "Didn't go well", "Need to improve", "extras"]
                    ],
                    msg: 'category should be one of Went well,Didnt go well,Need to improve,extras'
                }
            }
        }
    })
    return Point;
}