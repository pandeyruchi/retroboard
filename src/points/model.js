const Sequelize = require('sequelize')

module.exports = (sequelize) => {
    const Point = sequelize.define('point',{
        id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title:{
            type: Sequelize.STRING,
            allowNull:false,
            field:'title',
            validate: {
                notEmpty: {
                    msg: "Title must be a non empty string"
                },
                notNull: {
                    msg: "Title must be a non empty string"
                }
            }
        },
        description:{
            type:Sequelize.STRING,
            allowNull:false,
            field:'description'
        },
        category:{
            type: Sequelize.ENUM,
            values:['Went well',"Didn't go well","Need to improve","extras"]
        }
    })

    Point.associate = (models) =>{
        Point.belongsTo(models.Point);
    };

    return Point;
}