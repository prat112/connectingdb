//sequelize uses mysql

// const mysql = require('mysql2')

// const pool = mysql.createPool({
//     host : 'localhost',
//     user : 'root',
//     database : 'node_complete',
//     password : '123456'
// })

// module.exports = pool.promise() // before using sequelize

const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "Karthik@26", {
  dialect: "mysql", host : 'localhost'
});

module.exports = sequelize
