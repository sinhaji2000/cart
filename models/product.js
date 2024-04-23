// const db = require("../util/database");
// const Cart = require("./cart");

// // const p = path.join(
// //   path.dirname(process.mainModule.filename),
// //   "data",
// //   "products.json"
// // );

// // const getProductsFromFile = (cb) => {
// //   // console.log(cb) ;
// //   fs.readFile(p, (err, fileContent) => {
// //     // console.log(p) ;
// //     if (err) {
// //       cb([]);
// //     } else {
// //       // console.log(JSON.parse(fileContent)) ;
// //       cb(JSON.parse(fileContent));
// //     }
// //   });
// // };

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     //getProductsFromFile((products) => {
//     //   if (this.id) {
//     //     const existingProductIndex = products.findIndex(
//     //       (prod) => prod.id === this.id ,
//     //     );
//     //     const updateProduct = [...products];
//     //     updateProduct[existingProductIndex] = this;
//     //     fs.writeFile(p, JSON.stringify(updateProduct), (err) => {
//     //       console.log(err);
//     //     });
//     //   } else {
//     //     this.id = Math.random().toString();
//     //     products.push(this);
//     //     fs.writeFile(p, JSON.stringify(products), (err) => {
//     //       console.log(err);
//     //     });
//     //   }
//     // });

//     return db.execute(
//       "INSERT INTO products (title , price ,description , imageUrl)  VALUES(? , ? , ? , ?)",
//       [this.title, this.price, this.description, this.imageUrl]
//     );
//   }

//   static deleteById(id) {
//     // getProductsFromFile((products) => {
//     //   const product = products.find((id) => {
//     //     products.id === id ;
//     //   })
//     //   const updateProduct = products.filter((prod) => prod.id !== id)
//     //   fs.writeFile(p , JSON.stringify(updateProduct) , err => {
//     //     if(!err) {
//     //       Cart.deleteProduct(id , product.price) ;
//     //     }
//     //   }) ;
//     // })

//     db.execute('DELETE FROM products WHERE products.id = ? ' , [id]) ;
//   }

//   static fetchAll() {
//     //   getProductsFromFile(cb);
//     // }

//     // static findById(id, cb) {
//     //   // console.log(products) ;
//     //   getProductsFromFile((products) => {
//     //     const product = products.find((p) => p.id === id);
//     //     cb(product);
//     //   });

//     return db.execute("SELECT * FROM products");
//   }

//   static findById(id) {

//     return db.execute('SELECT * FROM products WHERE products.id = ?' , [id]) ;
//   }
// };


const Sequelize = require('sequelize') ;
const sequelize = require('../util/database') ;

const Product = sequelize.define('product' , {
  id: {
    type : Sequelize.INTEGER ,
    autoIncrement : true ,
    allowNull: false ,
    primaryKey : true 
  } ,
  title : Sequelize.STRING ,
  price : {
    type : Sequelize.INTEGER ,
    allowNull : false ,
  } ,
  imageUrl : {
    type : Sequelize.STRING ,
    allowNull : false ,
  } ,
  description : {
    type : Sequelize.STRING ,
    allowNull : false ,
  }
})

module.exports = Product ;