
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
  }
  

    

})
module.exports = mongoose.model("User",UsersSchema)