const mongoose =require("mongoose")
const FailedBookingsSchema =  new mongoose.Schema({
    User:{
        type:{ type:mongoose.Types.ObjectId,ref:"User"}
     },
    
    service:{
        type:String
    },
    booking_date:{
        type:Date
    }
})
module.exports = mongoose.model("FailedBooking",FailedBookingsSchema)