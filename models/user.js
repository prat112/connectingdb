const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    name : {
        type:Sequelize.STRING,
        allowNull:false
    },
    email : {
        type:Sequelize.STRING,
        allowNull:false
    }
})
module.exports = User;

/*
    ASSOCIATION
    PRODUCT---belongs to many --> CART
    USER --- has one --> CART
    PRODUCT-- belongs to many --> ORDER
    USER -- has many --> ORDER
    USER -- has many --> PRODUCT
*/