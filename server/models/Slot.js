
const mongoose =require("mongoose")
const SlotsSchema =  new mongoose.Schema({
    slot_date:{
        type:Date
    },
  quantity:{
      type:Number

  }
    

})
module.exports = mongoose.model("Slot",SlotsSchema)