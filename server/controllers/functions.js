const User = require("../models/User")

//  checking for user exist ,if not save in db
// export is used because is will be imported in other files 
exports.getuser = async(phone_number)=>{
    // retrive data based on the users phone number
    let user = await User.findOne({phone_number:phone_number})
    // logic if no user save it
    if(!user){
       user = new User({
           phone_number:phone_number
       })
       await user.save()
  
    }  return user;
}