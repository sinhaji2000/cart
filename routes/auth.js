const path = require("path");

const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();

const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("please enter valid email")
      .normalizeEmail(),
    body("password", "password has to be valid")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.find({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Email exist alredy , please use differnt one"
            );
          }
        });
      }),
    body("password", "please enter  valid password")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .normalizeEmail()
      .trim(),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("password not match");
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);
router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPaswword);

module.exports = router;
