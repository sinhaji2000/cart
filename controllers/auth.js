const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const sendgridTrasport = require("nodemailer-sendgrid-transport");
const { reset } = require("nodemon");



exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req.get("Cookie").split(",")[1].trim().split("=")[1];
  // const isLoggedIn = req
  //   .get("Cookie")
  //   .split(";")
  //   .find((cookie) => cookie.trim().startsWith("loggedIn="))
  //   ?.split("=")[1];

  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    path: "login",
    pageTitle: "login",
    errorMessage: message,
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
      req.flash("error", "invalid email or password");
      return res.redirect("/login");
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

          // return transporter.sendMail({
          //   to : email ,
          //   from : 'cart-shop@gmail.com' ,
          //   subject : 'sugnup succesfully' ,
          //   html : '<h1>You succefully signup </h1>'
          // }).catch(err => {
          //   console.log(err) ;
          // })
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

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    console.log(token.toString());
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        //   transporter.sendMail({
        //     to: req.body.email,
        //     from: 'shop@node-complete.com',
        //     subject: 'Password reset',
        //     html: `
        //       <p>You requested a password reset</p>
        //       <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
        //     `
        //   });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPaswword = (req, res, next) => {
  const newpassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      console.log(user) ;
      return bcrypt.hash(newpassword, 12);
    })
    .then((hashPassword) => {
      resetUser.password = hashPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect('/login') ;
    })
    .catch((err) => {
      console.log(err);
    });
};
