require("../models/mongooseConnection")
 const Slot = require("../models/Slot")
  const Booking = require("../models/Booking")
    const FailedBooking = require("../models/FailedBooking")
    const User = require("../models/User")
    

// fetching the function that checks and save the user
const Util = require("./functions") 

exports.index = async(req,res)=>{
    const slots = await Slot.find({})
    res.render("slots/index",{title:"Slot",slots})
}

exports.add = async(req,res)=>{  
    res.render("slots/add",{title:"Slot", csrfToken:req.csrfToken()})
}

exports.save =async(req,res)=>{
    const slots = await Slot.findOne({slot_date:[req.body.slot_date]})
    if(!slots){
    const slot =  new  Slot({
        slot_date:new Date(req.body.slot_date),
        quantity:req.body.quantity

    })
     await slot.save()
    }else{
        slots.quantity = slots.quantity + parseInt(req.body.quantity)
        await slots.save()
    }
    res.redirect(302,"/slots")
}

exports.edit = async(req,res) =>{
    res.render("slots/edit",{title:"Slot"})
}


exports.update = async(req,res) =>{
 res.redirect(302,"/index")
}

exports.getdelete = async(req,res) =>{
    res.render("slots/delete",{title:"Slot"})
}

exports.delete = async(req,res) =>{
    res.redirect(302,"/index")
}
// book
 exports.book  =async(req,res) =>{
     const slot =await Slot.findById(req.params.id)
     res.render("slots/book",{title:"Booking",slot,csrfToken:req.csrfToken()})
  
 }

 exports.save_book =async(req,res) =>{

 // check if user exist
let phone_number = req.body.phone_number
// calling the function getuser  to be able to check the phone number logic
const user =await Util.getuser(phone_number)
     const slot = await Slot.findById(req.params.id)

// // logic
// booking is done based on the particuler slot so the logic will br done based on the slot
// so if slot is greater than zero booking is saves

if( slot.quantity > 0){
const booking =  new Booking({
      user:user._id,
    service:req.body.service,
    slot:req.params.id
})
await booking.save()

// reducing slot by one after saving
slot.quantity -=1;
await slot.save() 
// let newslotquantity = await Slot.updateOne({_id:slot._id},{quantity:slot.quantity-1})
if(!user.name){
    res.render("slots/user",{title:"form",user,error:"Please Provide us with your name",csrfToken:req.csrfToken()})
}else{
    res.redirect(302,'/bookings')
}

}
   // if slot is less than zero  then save as failedboking
else{
    const failedbooking = new FailedBooking({
    service:req.body.service,
    user:user._id,
    booking_date:slot.slot_date

}) 

await failedbooking.save()
if(!user.name){
    res.render("slots/user",{title:"user-form",user,error:"Please Provide us with your name",csrfToken:req.csrfToken()})
}else{
res.redirect(302,'/bookings')

}


}
 }

 // saving users name
exports.updateUser = async(req,res)=>{
    let phone_number = req.body.phone_number
    const user = await User.findOne({phone_number:phone_number})
    user.name = req.body.name;
    user.password = req.password;
 await user.save();
// console.log(req.body)
 res.redirect(302,'/bookings')
}