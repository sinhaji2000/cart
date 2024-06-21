const Product = require("../models/product");
const Order = require("../models/order");
const Cart = require("../models/cart");
const mongodb = require("mongodb");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log(products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated : req.session.isLoggedIn
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
        isAuthenticated : req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated : req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

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
        isAuthenticated : req.session.isLoggedIn
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
          name: req.session.user.name,
          userId: req.session.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((results) => {
      return req.session.user.clearCart();
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
        isAuthenticated : req.session.isLoggedIn
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
    isAuthenticated : req.session.isLoggedIn
  });
};
