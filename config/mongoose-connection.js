const mongoose = require("mongoose")

module.exports = {
    connect:()=>{
        mongoose.connect("mongodb://0.0.0.0/mykhatabook").then(()=>{
            console.log("connected to mongodb")
        }).catch((err)=>{
            console.log("error connecting to db")
        })
    }
}