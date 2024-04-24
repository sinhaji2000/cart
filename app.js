const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");

const User = require("./models/user");

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const Product = require("./models/product");

// db.execute('SELECT * FROM products').then((result) => {

//       console.log(result) ;
// }).catch((err) => {
//       console.log(err) ;
// }) ;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req , res , next) => {
  User.findByPk(1).then(user => {
    req.user = user ;
    next() ;
  }).catch(err => console.log(err)) ;
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

sequelize
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        // id: 1,
        name: "Mukesh sinha",
        email: "mukeshsinha.ocsm@gmail.com",
      });
    }

    return user;
  })
  .then((user) => {
    // console.log(user );
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
