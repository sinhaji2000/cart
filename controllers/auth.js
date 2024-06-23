const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req.get("Cookie").split(",")[1].trim().split("=")[1];
  // const isLoggedIn = req
  //   .get("Cookie")
  //   .split(";")
  //   .find((cookie) => cookie.trim().startsWith("loggedIn="))
  //   ?.split("=")[1];

  let message = req.flash('error') ;
  if(message.lenght > 0) {
    message = message[0] ;
  }else{
    message = null ;
  }

  res.render("auth/login", {
    path: "login",
    pageTitle: "login",
    errorMessage : message
    // isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    
    // isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  //   res.setHeader("set-cookie", "loggedIn=true");

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash('error' , 'invalid email or password')
      return res.redirect("/signup");
    }
    bcrypt
      .compare(password, user.password)
      .then((isValidUser) => {
        if (isValidUser) {
          req.session.isLoggedIn = true;
          req.session.user = user;

          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }

        return res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/login");
      });
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const conformPassword = req.body.conformPassword;

  // if (password !== conformPassword) {
  //   return res.status(400).send("Passwords do not match");
  // }

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/login");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashPasword) => {
          const user = new User({
            email: email,
            password: hashPasword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/");
        });
    })

    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  //   res.setHeader("set-cookie", "loggedIn=true");

  req.session.destroy(() => {
    res.redirect("/");
  });
};
