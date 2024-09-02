const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        trim :true
    },
    email:{
        type:String,
        lowercase:true,
        required:[true,"email is required"],
        trim:true,
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    hisaab:[{type: mongoose.Schema.Types.ObjectId, ref:"hisaab"}]


})

module.exports = mongoose.model("user",userSchema); 