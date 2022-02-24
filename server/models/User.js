
const mongoose = require("mongoose")
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
  
  status:{
     type: Boolean,
     default:true 
  },

  role:{
      type:String,
      default:"user"
  }
    

})
module.exports = mongoose.model("User",UsersSchema)