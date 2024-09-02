const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const { isloggedin } = require("../middlewares/isloggedin");
const hisaabModel = require("../models/hisaabModel");

module.exports.homepageController = function (req, res) {
  let message = req.flash("error");
  res.render("index", { isloggedin: false, });
};




module.exports.registerPageController = async function (req, res, next) {
  res.render("register", { isloggedin: false });
};
module.exports.registerController = async function(req,res,next){
  let {email,username, password} = req.body
  if(!username || !password || !email){
    req.flash("error", "all the fields are required")
   return res.redirect("/register")
  }

  let emailUser = await userModel.findOne({email})
  if(emailUser){
    req.flash("error","the email already exists")
    return res.redirect("/register")
  }
  let usernameUser = await userModel.findOne({username})
  if(usernameUser){
    req.flash("error","the username already exists")
    return res.redirect("/register")
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt)

  const newUser = new userModel({
    username,
    email,
    password:hashPassword
    })
    
    await newUser.save();

    const token  =  jwt.sign({id:newUser._id },process.env.JWT_SECRETKEY)
    res.cookie = ("token", token)
    res.redirect("/profile")
}
module.exports.logoutController = async function(req,res,next){
  res.cookie("token","")
  res.redirect("/")
}
module.exports.loginController = async function(req,res,next){
  let {email, password} = req.body
  if(!email|| !password){
    req.flash("error", "all fields are required")
    return res.redirect("/")
  }
  let user = await userModel.findOne({ email });

  if (!user) {
    req.flash("error", "User not found");
    res.redirect("/");
    return; // Ensure we exit the function after redirecting
  }
  
  
  // Before comparing passwords, ensure both 'password' and 'user.password' are not null or undefined
  if (!password || !user.password) {
    req.flash("error", "Invalid credentials");
    res.redirect("/");
    return;
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    req.flash("error", "Password does not match");
    res.redirect("/");
    return;
  }
  
  // Continue with successful authentication logic...
  
  else{
    const token  =  jwt.sign({id:user._id},process.env.JWT_SECRETKEY)
    res.cookie("token",token)
    res.redirect("/profile")
  }
}
module.exports.profileController = async function (req, res, next) {
const id = req.user.id
const startDate = req.query.startDate;
const endDate = req.query.endDate;
const order = req.query.byDate ? Number(req.query.byDate):-1;
const user = await userModel.findOne({_id:id})
const hisaab = await hisaabModel.find({
  user:user._id,
  createdAt:{
    $gte:startDate ? new Date(startDate): new Date(0),
    $lt:endDate ? new Date(endDate): new Date()

  }
}).sort({createdAt:order}).exec();
res.render("profile",{isloggedin:true,user,hisaab})
}

