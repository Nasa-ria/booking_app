require("../models/mongooseConnection");
const express = require("express");
const Booking = require("../models/Booking");
const Slot = require("../models/Slot");
const FailedBooking = require("../models/FailedBooking");
const User = require("../models/User");
const bcrypt = require('bcrypt')

const Util = require("./functions");

  const getNumber =async(req,res)=>{
	  if(req.user == isAuthenticated()){
		  const user = await User.findById(req.params.id)
	  }
  }
exports.index = async (req, res) => {
	const bookings = await Booking.find({})
		.populate("user")
		.populate("slot")
		.sort({ user: -1, slot: 1 });
	let booking_display = Util.booking_user(bookings);
	res.render("bookings/index", {
		title: "Booking",activeNav :"booking",
		bookings,
		booking_display,
		csrfToken: req.csrfToken(),});
};

exports.add = async (req, res) => {
	const authorizatedRoles=['user']
	 Util.authorization(req,res,authorizatedRoles);
	const slot = await Slot.find({});
    const booking =await Booking.findById(req.params.id)
	res.render("bookings/add", {
		title: "Booking",
		slot,booking,
		csrfToken: req.csrfToken(),
	});
};

exports.save = async (req, res) => {
	// check if user exist
	let phone_number = req.body.phone_number;
	// calling the function getuser  to be able to check the phone number logic
	const user = await Util.getuser(phone_number);
	// const booking = await Booking.findById(req.params.id)
	// check for date
	const booking_date = req.body.booking_date;
	// // condition for checking date
	const next_date = new Date(booking_date);
	next_date.setDate(next_date.getDate() + 1);

	// //condition for  checking for the date and the quantity of slot.
	const slots = await Slot.find({
		slot_date: {
			$gte: new Date(booking_date),
			$lt: new Date(next_date),
		},
		quantity: { $gt: 0 },
	});
	// // if logic is checked book bookings
	if (slots.length > 0) {
		let slot = slots[0];
		const booking = new Booking({
			service: req.body.service,
			slot: slot._id,
			user: user._id,
		});
		await booking.save();
		// reducing slot by one after saving
		slot.quantity -= 1;
		if (slot.quantity < 0) {
			slot.quantity = 1;
			res.end("slot quantity expired");
		} else {
			await slot.save();
		}
		if (!user.name) {
			res.render("bookings/user", {
				title: "Form",
				user,
				error: "Please Provide us with your name",
				csrfToken: req.csrfToken(),
			});
		} else {
			res.redirect(302, "/bookings");
		}

		// if slot is less than zero  then save as failedboking
	} else {
		const failedbooking = new FailedBooking({
			user: user._id,
			booking_date: booking_date,
			service: req.body.service,
		});
		await failedbooking.save();
		if (!user.name) {
			res.render("bookings/user", {
				title: "Form",
				user,
				error: "Please Provide us with your name",
				csrfToken: req.csrfToken(),
			});
		} else {
			res.redirect(302, "/bookings");
		}
	}
};
// saving users name
exports.updateUser = async (req, res) => {
	let phone_number = req.body.phone_number;
	const user = await User.findOne({ phone_number: phone_number });
	const hashedPassword = await bcrypt.hash(req.body.password,10)
	user.name = req.body.name;
	user.password = req.password;
	user.password = hashedPassword;
	await user.save();
	console.log(user)
	res.redirect(302, "/bookings");
};

exports.edit = async (req, res) => {
	res.render("bookings/edit", { title: "Booking" });
};

exports.update = async (req, res) => {
	res.redirect(302, "/bookings");
};

exports.getdelete = async (req, res) => {
	res.render("bookings/delete", { title: "Booking" });
};

exports.delete = async (req, res) => {
	res.redirect(302, "/bookings");
};
