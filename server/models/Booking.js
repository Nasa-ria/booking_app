 
const mongoose =require("mongoose")
const BookingsSchema =  new mongoose.Schema({

    slot:{ type:mongoose.Types.ObjectId,ref:"Slot"},
    user:{ type:mongoose.Types.ObjectId,ref:"User"},
    service:{
        type:String
    },
    booking_date:{
        type:Date
    }

})
module.exports = mongoose.model("Booking",BookingsSchema)