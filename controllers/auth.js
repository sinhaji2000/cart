const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req.get("Cookie").split(",")[1].trim().split("=")[1];
  // const isLoggedIn = req
  //   .get("Cookie")
  //   .split(";")
  //   .find((cookie) => cookie.trim().startsWith("loggedIn="))
  //   ?.split("=")[1];

  res.render("auth/login", {
    path: "login",
    pageTitle: "login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  //   res.setHeader("set-cookie", "loggedIn=true");

  User.findById("666035625a5cc47f625f8440")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      // res.setHeader("set-cookie", "loggedIn=true");

      req.session.save(() => {
        res.redirect("/");
      })

      // next();
    })
    .catch((err) => console.log(err));
};



exports.postLogout = (req, res, next) => {
  //   res.setHeader("set-cookie", "loggedIn=true");

  req.session.destroy(() => {
    res.redirect('/')
  })
};