// const mysql = require('mysql2') ;

// const pool = mysql.createPool({
//       host : 'localhost' ,
//       user : 'root' ,
//       database : 'cart' ,
//       password: 'Lumia540'
// })

// module.exports = pool.promise() ;

const Sequelize = require("sequelize");

const sequelize = new Sequelize("cart", "root", "Lumia540", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize ;