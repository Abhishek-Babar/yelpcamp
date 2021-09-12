const express = require("express");
const User = require("../models/user");
const CatchAsync = require("../utilis/CatchAsync");
const passport = require("passport");
const app = express();
const router = express.Router();
const users = require("../controllers/users");

router.route("/register")
      .get(users.registerForm)
      .post(CatchAsync(users.newUser))

router.route("/login")
      .get(users.loginForm)
      .post(passport.authenticate("local",{failureFlash:true,failureRedirect:"/user/login"}),users.login)

router.get("/logout",users.logout)

module.exports = router;