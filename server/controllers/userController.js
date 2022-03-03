require("../models/mongooseConnection")
const User = require("../models/User")
const bcrypt = require('bcrypt')

const Util = require("./functions");


exports.index = async(req,res)=>{
    const authorizatedRoles=['admin']
  Util.authorization(req,res,authorizatedRoles);
     const users = await User.find({})
     res.render("users/index",{title:"Users",users})

}

exports.login = async(req,res)=>{
    const message = req.flash().error;
    res.locals.csrfToken = req.csrfToken()
    res.render("users/login",{title:"login-formn",message})
}

exports.authenticatelogin = async(req,res) =>{ 
    res.redirect(302,"/")
}

exports.profile = async(req,res)=>{
    res.render("users/profile",{title:"Users-profile"})
}

exports.logout =async(req,res)=>{
    // res.local.csrfToken = req.csrfToken();
    req.logout()
res.redirect(302,'/users/login')

}


exports.edit = async(req,res)=>{ 
    const authorizatedRoles=['admin']
    return  Util.authorization(req,res,authorizatedRoles);
    res.locals.csrfToken = req.csrfToken()
    const user = await User.findById(req.params.id)
res.render("users/edit",{title:"User Form",user})

}
exports.update = async(req,res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password,10)
    const user = await User.updateOne({_id:req.params.id },
{
    name:req.body.name,
    phone_number:req.body.phone_number,
    password :hashedPassword
})
    res.redirect(302,"/users")
}


exports.add = async(req,res)=>{
    const authorizatedRoles=['admin']
   return Util.authorization(req,res,authorizatedRoles);
    res.locals.csrfToken = req.csrfToken()
    res.render("users/add",{title:"User From"})
}
exports.save = async(req,res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password,10)
    const user = new User ({
        name : req.body.name,
        phone_number:req.body.phone_number,
        password : hashedPassword,
        role:"admin"
    })
    await user.save()
    res.redirect(302,"/users")
}

exports.getdelete = async(req,res) =>{
    const authorizatedRoles=['admin']
    return  Util.authorization(req,res,authorizatedRoles);
    res.locals.csrfToken = req.csrfToken()
    const user = await User.findById(req.params.id)
    res.render("users/delete",{title:"User Form",user})
}
exports.delete = async(req,res) =>{
const user = await User.deleteOne({_id:req.params.id})    
    res.redirect(302,"/users")
}

exports.change = async(req,res) =>{
    res.locals.csrfToken = req.csrfToken()
    res.render("users/change",{title:"change-password",activeNav :"profile"})
}
exports.savechange = async(req,res)=>{
    res.locals.csrfToken = req.csrfToken()
    const message = req.flash().error;
    let initialpassword = await bcrypt.compare(req.body.current_password,req.user.password)
    if(!initialpassword ){
       res.render("users/change",{message:"incorrect current password",title:"change-password" })  
       
    }else {
    newupdate = req.body.new_password == req.body.confirm_password
     if(initialpassword && newupdate){
       const newhashed = await  bcrypt.hash(req.body.new_password,10)
          const user = await User.updateOne({_id:req.user._id},{password:newhashed})
           return res.redirect(302,"/profile")

     }else{
         if(!newupdate){
        res.render("users/change",{ message :"your new password does not match the confirm password" ,title:"change-password"}) 
     }
         
    }
  res.render("users/change",{title:"change-password",activeNav :"profile"})
   }
}

exports.forcepassword = async(req,res) => {
    const authorizatedRoles=['admin']
    Util.authorization(req,res,authorizatedRoles);
    res.locals.csrfToken = req.csrfToken()
    res.render("users/force-password",{title:"force-change"})
}
exports.saveforcepassword =async(req,res) => {
    res.redirect(302,"/force-password")
}