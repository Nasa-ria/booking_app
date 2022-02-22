
const mongoose =require("mongoose")
const UsersSchema =  new mongoose.Schema({
    name:{
        type:String
    },
  phone_number:{
      type:String

  },
  password:{
      type:String
  },
  
  staus:{
     type: Boolean,
     default:true 
  }
    

})
module.exports = mongoose.model("User",UsersSchema)