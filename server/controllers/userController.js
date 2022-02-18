require("../models/mongooseConnection")
const User = require("../models/User")

exports.index = async(req,res)=>{
    res.render("users/index",{title:"Users"})
}

exports.login = async(req,res)=>{
    res.locals.csrfToken = req.csrfToken()
    res.render("users/login",{title:"login-formn"})
}
exports.authenticatelogin = async(req,res) =>{
    
    res.redirect(302,"/")
}

exports.profile = async(req,res)=>{
    res.render("users/profile",{title:"Users-profile"})
}

exports.logout =async(req,res)=>{
    req.logout()

res.redirect(302,'/')

    // res.render("users/logout",{title :"logout"})
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