const product = require("../models/product");
const Product = require("../models/product");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const { validationResult } = require('express-validator');
const fileHelper = require('../util/file')



exports.getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    // isAuthenticated : req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  if (!image) {
    return res.status(422).render("admin/product-edit", {
      pageTitle: "add-product",
      path: "admin/add-product",
      editing: false,
      hasError: true,

      product: {
        title: title,
        // image : image ,
        price: price,
        description: description,
      },
      errorMessage: "attach file not valid",
      validation,
    });
  }
  // console.log(imageUrl);
  const imageUrl = image.path;

  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description,
    userId: req.user,
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
        // isAuthenticated : req.session.isLoggedIn
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
  const image = req.file;
  const updateDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updateTitle;
      product.price = updatePrice;
      product.description = updateDesc;
      // product.imageUrl = updateImage ;
      if (image) {
        fileHelper.deleteFile(product.imageUrl)
        product.imageUrl = image.path;
      }
      return product.save().then((result) => {
        console.log("UPDATE PRODUCT");
        res.redirect("/admin/products");
      });
    })

    .catch((err) => console.log(err));

  // product.save();
};

exports.postDeleteproduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then(product =>{
    if(!product){
      return next(new Error('Product not found')) ;
    }
    fileHelper.deleteFile(product.imageUrl)
    return Product.deleteOne({ _id: prodId, userId: req.user._id })

  })
  .then(() => {
    console.log("PRODUCT DESTROYED");
    res.redirect("/admin/products");
  })
  .catch((err) => console.log(err));

  
};
exports.getProducts = (req, res, next) => {
  const prodId = req.body.productId;
  Product.find({ userId: req.user._id })
    .populate("userId")
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        // isAuthenticated : req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
