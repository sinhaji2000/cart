const Sequelize = require('sequelize') ;
const sequelize = require('../util/database') ;

const CartItem = sequelize.define('cartItem' , {

  id : {
    type : Sequelize.INTEGER ,
    autoIncrement : true ,
    allowNull : false ,
    primaryKey : true ,
  } ,
  itemQuatity : Sequelize.INTEGER ,
})

module.exports = CartItem ;