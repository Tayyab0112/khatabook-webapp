const express = require("express");
const router = express.Router();

const {
  homepageController,
  logoutController,
  profileController,
  registerPageController,
  registerController,loginController
} = require("../controllers/indexController");
const { isloggedin } = require("../middlewares/isloggedin");

router.get("/", homepageController);
router.post("/login", loginController)
router.get("/logout", logoutController);
router.get("/register",registerPageController);
router.post('/register', registerController)
router.get("/profile", isloggedin,profileController);

module.exports = router;
