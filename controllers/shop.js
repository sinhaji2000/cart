const Product = require("../models/product");
const Order = require("../models/order");
const Cart = require("../models/cart");
const mongodb = require("mongodb");
const fs = require("fs");
const path = require("path");

const PDFDocument = require("pdfkit");
const ITEM_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalProdusts ;


  Product.find()
    .countDocuments()
    .then((noOfProduts) => {
      totalProdusts = noOfProduts ;
      return Product.find()
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);
    })

    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "products-list",
        path: "/products",
        totalProdusts : totalProdusts ,
        currentPage : page ,
        hasNextPage : ITEM_PER_PAGE * page < totalProdusts ,
        hasPreviousPage : page > 1 ,
        nextPage : page + 1 ,
        previousPage : page - 1 ,
        lastPage : Math.ceil(totalProdusts / ITEM_PER_PAGE) ,

      });
    })
    .catch((err) => console.log(err));

  // Product.fetchAll().then(([row , results]) =>{
  //   res.render("shop/product-list", {
  //     prods: row,
  //     pageTitle: "All Products",
  //     path: "/products",
  //   });

  // }).catch((err) =>{
  //   console.log(err) ;
  // })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      // console.log(product)
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        // isAuthenticated : req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalProdusts ;


  Product.find()
    .countDocuments()
    .then((noOfProduts) => {
      totalProdusts = noOfProduts ;
      return Product.find()
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE);
    })

    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        totalProdusts : totalProdusts ,
        currentPage : page ,
        hasNextPage : ITEM_PER_PAGE * page < totalProdusts ,
        hasPreviousPage : page > 1 ,
        nextPage : page + 1 ,
        previousPage : page - 1 ,
        lastPage : Math.ceil(totalProdusts / ITEM_PER_PAGE) ,

      });
    })
    .catch((err) => console.log(err));
};
// <%- include('../includes/pagination.ejs', {totalProdusts : totalProdusts , currentPage :currentPage , hasNextPage : hasNextPage , hasPreviousPage :hasPreviousPage , nextPage : nextPage , previousPage : previousPage , lastPage}) %>
// <%}%>
exports.getCart = (req, res, next) => {
  // Cart.getCart((cart) => {
  //   Product.fetchAll((products) => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render("shop/cart", {
  //       path: "/cart",
  //       pageTitle: "Your Cart",
  //       products: cartProducts,
  //     });
  //   });
  // });

  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // console.log(user.cart.items , "getCart") ;
      products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        // isAuthenticated : req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  // console.log(prodId , "prodId from shop") ;

  Product.findById(prodId)
    .then((product) => {
      // console.log(product , 'prddo') ;
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");

      // console.log(result, "resut");
    });
  // let fetchedCart;
  // let newQuantity = 1;

  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     let product;

  //     if (products.length > 0) {
  //       product = products[0];
  //     }

  //     if (product) {
  //       const oldQunaity = product.cartItem.quantity;
  //       newQuantity = oldQunaity + 1;

  //       return product;

  //       // return fetchedCart.addProduct(product , {through : {quantity : newQuantity}}) ;
  //     }
  //     return Product.findByPk(prodId);

  //     // return Product.findByPk(prodId)
  //     // .then((product) => {
  //     //   return fetchedCart.addProduct(product  , {through : {quantity : newQuantity}}) ;
  //     // })
  //     // .catch((err) => console.log(err));
  //   })
  //   .then((product) => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => {
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err));
  // // Product.findById(prodId, (product) => {
  // //   Cart.addProduct(prodId, product.price);
  // // });
  // // res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .removeFromCart(prodId)
    .then((results) => {
      console.log(results);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));

  // Product.findById(prodId, (product) => {
  //   Cart.deleteProduct(prodId, product.price);
  //   res.redirect("/cart");
  // });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          // name: req.session.user.name,
          email: req.user.email,
          userId: req.session.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((results) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })

    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        // isAuthenticated : req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
  // req.user
  //   .getOrders()
  //   .then((orders) => {
  //     console.log(orders);
  //     rs: orders,
  //     });
  //   })
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
    // isAuthenticated : req.session.isLoggedIn
  });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  console.log(orderId);
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("order not found"));
      }
      console.log(order.user.userId.toString());
      // console.log(req.user._id.toString())

      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Anaouthorised"));
      }

      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join("data", "invoice", invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            `${prod.product.title} - ${prod.quantity} X ${prod.product.price}`
          );
      });
      pdfDoc.text("-----------------------------------------");
      pdfDoc.text(`Total Price ${totalPrice}`);
      pdfDoc.end();
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }

      //   res.setHeader("Content-Type", "application/pdf");

      //   res.send(data);
      // });

      fs.createReadStream(invoicePath);
      res.setHeader("Content-Type", "application/pdf");
      file.pipe(res);
    })
    .catch((err) => {
      return next(err);
    });
};
