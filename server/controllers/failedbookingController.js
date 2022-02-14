require("../models/mongooseConnection")
const express = require("express")
 const FailedBooking = require("../models/FailedBooking")

 exports.index = async(req,res) =>{
     const failedbookings =  await FailedBooking.find({}) 
     res.render("failedbookings/index",{title:"FailedBooking",failedbookings})
 }