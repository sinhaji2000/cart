const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  // console.log(cb) ;
  fs.readFile(p, (err, fileContent) => {
    // console.log(p) ;
    if (err) {
      cb([]);
    } else {
      // console.log(JSON.parse(fileContent)) ;
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id ,
        );
        const updateProduct = [...products];
        updateProduct[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updateProduct), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    // console.log(products) ;
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
};
