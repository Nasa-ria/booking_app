require("../models/mongooseConnection")
const User = require("../models/User")

exports.index = async(req,res)=>{
    res.render("users/index",{title:"Users"})
}

exports.edit = async(req,res)=>{
   
res.render("users/edit",{title:"User Form"})

}


exports.update = async(req,res)=>{
    res.redirect(302,"/users")
}


exports.add = async(req,res)=>{
    res.render("users/add",{title:"User From"})
}
exports.save = async(req,res)=>{
    res.redirect(302,"/users")
}

exports.getdelete = async(req,res) =>{
    res.render("users/delete",{title:"User Form"})
}
exports.delete = async(req,res) =>{
    res.redirect(302,"/users")
}