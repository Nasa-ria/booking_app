const User = require("../models/User")
const Booking = require("../models/Booking")

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

// check if user has already book and if yes it add to it either than create a bookings display
exports. booking_user = (bookings) => {
	let display = "<div>";
	
	if (bookings) {
		let user = "";
		bookings.forEach((booking, index) => {
		    if(booking.user){
			if (user != booking.user._id) {
				display +=   "client Name :" + booking.user.name + "<br>";
				display += "booking date:" + booking.slot.slot_date.toDateString() + "<br>";
				display += "service opted for :" + booking.service + "<br>";
				user = booking.user._id;
			} else {
				display +=
					"booking date:" + booking.slot.slot_date.toDateString() + "<br>" ;
                    display += "service opted for :" + booking.service + "</ul>" + "</dv>";
			}
			}
		});
	} else {
		display = "no bookings found";
	}
	return display;
};
/**
 * check for authorization  based on the role
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} role 
 * @returns 
 */
exports.authorization = async (req,res,role) => {
	console.log(role)
	console.log(req.user.role)
	if(!role.includes(req.user.role )){
		 return res.render('error/unauthorized',{title:"Error"})
	}

}
