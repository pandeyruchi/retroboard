const Sequelize = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize) => {
    const Author = sequelize.define('author', {

        name: {
            type: Sequelize.STRING,
            allowNull: false,
            field: "name",
            validate: {
                notEmpty: {
                    msg: "Name must be a non empty string"
                },
                notNull: {
                    msg: "Name must be a non empty string"
                }
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
            validate: {
                isEmail: true,
                notEmpty: {
                    msg: "Please provide valid email"
                },
                notNull: {
                    msg: "Please provide valid email"
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            get() {
                return () => this.getDataValue('password')
            },
            allowNull: false,
        },
        salt: {
            type: Sequelize.STRING,
            get() {
                return () => this.getDataValue('salt')
            }
        }
    });

    Author.generateSalt = function() {
        return crypto.randomBytes(16).toString('base64')
    }
    Author.encryptPassword = function(plainText, salt) {
        return crypto
            .createHash('RSA-SHA256')
            .update(plainText)
            .update(salt)
            .digest('hex')
    }
   
   
    Author.prototype.isCorrectPassword = function(enteredPassword) {
        return Author.encryptPassword(enteredPassword, this.salt()) === this.password()
    }

    const setSaltAndPassword = author => {
        if (author.changed('password')) {
            author.salt = Author.generateSalt()
            author.password = Author.encryptPassword(author.password(), author.salt())
        }
    }
    Author.beforeCreate(setSaltAndPassword)
    Author.beforeUpdate(setSaltAndPassword)

    Author.associate = (models) => {
        Author.belongsTo(models.author);
    };

    return Author;
}