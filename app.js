const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const MONGODB_URL =
  "mongodb+srv://mukeshsinhakota:CWcpYAMYnFHpbBbu@cluster0.zsak1uh.mongodb.net/shop";

const errorController = require("./controllers/error");
// const mongoConnect = require('./util/database').mongoConnect;
const User = require("./models/user");

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// app.use((req, res, next) => {
//   User.findById("666035625a5cc47f625f8440")
//     .then((user) => {
//       req.user = user;
//       next();
//     })
//     .catch((err) => console.log(err));
// });

app.use((req, res, next) => {

  if(!req.session.user){
    return next() ;
  }

  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user ;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// mongoConnect(client => {
//   console.log('Connected to MongoDB!');
//   app.listen(3000, () => {
//     console.log('Server is running on port 3000');
//   });
// });

mongoose
  .connect(MONGODB_URL)

  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Mukesh sinha",
          email: "mukeshsinha.ocsm@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(3000);
  });

// AbXgHpQlFVq-RcRkxNSdBK81y9MHSdlC
// AbXgHpQlFVq-RcRkxNSdBK81y9MHSdlC
