const product = require("../models/product");
const Product = require("../models/product");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated : req.session.isLoggedIn
   
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId : req.user
  });

  // req.user
  //   .createProduct({
  //     title: title,
  //     price: price,
  //     imageUrl: imageUrl,
  //     description: description,
  //     userId: req.user.id,
  //   })

  //   .then((productData) => {
  //     res.redirect("/");
  //   })
  //   .catch((err) => console.log(err));
  product
    .save()
    .then((result) => {
      // console.log(result);
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  // console.log(prodId) ;
  Product.findById(prodId)

    // console.log(product) ;
    .then((product) => {
      // const product = products[0] ;
      console.log(product);
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        productId: prodId,
        isAuthenticated : req.session.isLoggedIn
      });
    })

    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updateTitle = req.body.title;
  const updatePrice = req.body.price;
  const updateImage = req.body.imageUrl;
  const updateDesc = req.body.description;

  Product.findById(prodId).then(product => {
    product.title = updateTitle ;
    product.price = updatePrice ;
    product.description = updateDesc ;
    product.imageUrl = updateImage ;
    return product.save() ;
  })
    .then((result) => {
      console.log("UPDATE PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));

  // product.save();
};

exports.postDeleteproduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findByIdAndDelete(prodId)
    .then(() => {
      console.log("PRODUCT DESTROYED");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
exports.getProducts = (req, res, next) => {
  // Product.findAll()
  Product.find()
  .populate('userId')
    .then((products) => {
      console.log(products) ;
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated : req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
