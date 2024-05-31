// const mysql = require('mysql2') ;

// const pool = mysql.createPool({
//       host : 'localhost' ,
//       user : 'root' ,
//       database : 'cart' ,
//       password: 'Lumia540'
// })

// module.exports = pool.promise() ;

// const Sequelize = require("sequelize");

// const sequelize = new Sequelize("cart", "root", "Lumia540", {
//   dialect: "mysql",
//   host: "localhost",
// });

// module.exports = sequelize ;

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://mukeshsinhakota:CWcpYAMYnFHpbBbu@cluster0.zsak1uh.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'
  )
    .then(client => {
      console.log('Connected!');
      _db = client.db();
      callback(client);
    })
    .catch(err => {
      console.log('MongoDB connection error:', err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No Database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;


// CWcpYAMYnFHpbBbu
