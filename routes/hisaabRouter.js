const express = require("express");
const router = express.Router();


const {
  createPageController,
  readHisaabController,
  createHisaabController,
  editPostController,
  deleteHisaabController,editHisaabController,
  readverifiedhisaab
  
} = require("../controllers/hisaabController");
const { isloggedin } = require("../middlewares/isloggedin");

router.get("/create", isloggedin,createPageController);
router.post("/create",isloggedin,createHisaabController)
router.get("/edit/:id",isloggedin,editHisaabController)
router.post("/edit/:id",isloggedin,editPostController)
router.get("/view/:id",isloggedin, readHisaabController);
router.get("/delete/:id",isloggedin, deleteHisaabController);
router.post("/verify/:id",isloggedin,readverifiedhisaab)
module.exports = router
;
