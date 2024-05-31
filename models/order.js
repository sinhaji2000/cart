const Sequelize = require('sequelize') ;
const sequelize = require('../util/database') ;

const Oreder = sequelize.define('order' , {

  id : {
    type : Sequelize.INTEGER ,
    autoIncrement : true ,
    allowNull : false ,
    primaryKey : true ,
  } ,
 
})

module.exports = Oreder ;