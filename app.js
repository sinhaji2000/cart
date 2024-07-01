const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const MONGODB_URL =
  "mongodb+srv://mukeshsinhakota:CWcpYAMYnFHpbBbu@cluster0.zsak1uh.mongodb.net/shop";

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === image / png ||
    file.mimetype === image / jpeg ||
    file.mimetype === image / jpg
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: diskStorage }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use('/images' , express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

const csrfProtection = csrf();
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  console.log("CSRF Token:", req.csrfToken());
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
      next(new Error(err));
    });
});

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);
app.use("/500", errorController.get500);

mongoose
  .connect(MONGODB_URL)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
