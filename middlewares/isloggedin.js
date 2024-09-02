const jwt =  require("jsonwebtoken")
const bcrypt = require("bcrypt")
const isloggedin = function(req,res,next){
const token = req.cookies.token
if(!token){
    res.redirect("/")
    return 
}
try{
    let decoded = jwt.verify(token, process.env.JWT_SECRETKEY )
    if(decoded){
        req.user = decoded;
        next();
    }
    else{
        res.redirect("/login")
    }
}catch{
    res.redirect("/")
}

}
module.exports= {isloggedin}