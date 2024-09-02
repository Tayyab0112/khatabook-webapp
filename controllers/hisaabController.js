const { isloggedin } = require("../middlewares/isloggedin");
const hisaabModel = require("../models/hisaabModel");
const userModel = require("../models/userModel");

module.exports.createPageController = async function (req, res, next) {
  res.render("create",{isloggedin:true});
};


module.exports.createHisaabController = async function(req,res,next){
  let{title,description} = req.body

  if(!title||!description){
    req.flash("error","All fields are required")
    return res.redirect("/hisaab/create")
  }

  const isEditable = req.body.editpermissions === 'on' ? true : false 
  const encrypted = req.body.encrypted === 'on' ? true:false
  const isshareable = req.body.shareable === 'on'?true:false
  const passcode = req.body.passcode 

  const newhisaab  =  new hisaabModel({
    user:req.user.id,
    title,
    data: description,
    editable:isEditable,
    encrypted :encrypted,
    passcode,
    shareable:isshareable
  })

  await newhisaab.save();
  res.redirect("/profile",)
}
module.exports.readHisaabController = async function (req, res, next) {
  const id = req.params.id;
  const hisaab = await hisaabModel.findOne({_id:id})
  if(!hisaab){
    return res.redirect("/profile")
  }
  if(hisaab.encrypted){
    return res.render("passcode",{isloggedin:true,id})
  }
  return res.render("hisaab",{isloggedin:true,hisaab});
};

module.exports.deleteHisaabController = async function(req,res,next){
  const id = req.params.id
  const hisaab = await hisaabModel.findOne({
    _id:id,
    user:req.user.id
  })
  if(!hisaab){
    return res.redirect("/profile")
  }

  await hisaabModel.deleteOne({
    _id:id
  })

  return res.redirect("/profile")
}
module.exports.editHisaabController = async function(req,res,next){
  const id = req.params.id;

  const hisaab = await hisaabModel.findById(id)

  if(!hisaab){
    return res.redirect("/profile")
  }

  return res.render("edit",{isloggedin:true,hisaab})
}
module.exports.editPostController = async function(req,res,next){
  const id = req.params.id;
  const hisaab= await hisaabModel.findById(id);
  if(!hisaab){
    return res.redirect("/profile")
  }

  hisaab.title = req.body.title;
  hisaab.data = req.body.description;
  hisaab.editable = req.body.editpermissions === 'on' ? true : false 
  hisaab.encrypted = req.body.encrypted === 'on' ? true:false
  hisaab.shareable = req.body.shareable === 'on'?true:false
  hisaab.passcode = req.body.passcode 

  await hisaab.save();
  res.redirect("/profile")
}

module.exports.readverifiedhisaab = async function(req,res,next){
  const id = req.params.id;
  const hisaab = await hisaabModel.findOne({_id:id})
  if(!hisaab){
    return res.redirect("/profile")
  }
  if(hisaab.passcode !== req.body.passcode ){
    return res.redirect("/profile")
  }
  console.log(hisaab)
  return res.render("hisaab",{
    isloggedin:true,
    hisaab
  })


}