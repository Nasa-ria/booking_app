// requiring exress
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// requiring the appcontroller to to enable users
const controller = require("../controllers/userController");
const User = require("../models/User");
// creating a variable tha holds object for declaring route within our application
const router = require("express").Router();

passport.use(
	new LocalStrategy({ passReqToCallback: true }, async function verify(req,username,password,cb,) {
		// checks if the phone number inputed  matches
		const user = await User.findOne({ phone_number: username });
        console.log(user)
		if (user) {
			//   user attempt
			if (user.status) {
				//   and the password too
				if (user.password === password) {
					return cb(null, user); /* verification succesfull */
				}
			} else {
				return cb(null, false, {
					message: "your account has been deactivated",
				});
			}
		}
		Tracklogin(req, user);
		return cb(null, false, {
			message: "incorrect  phone number or password",
		}); /* verification failed */
	}),
);

passport.serializeUser(function (user, cb) {
	return cb(null, user);
});

passport.deserializeUser(function (user, cb) {
	return cb(null, user);
});

router.use(passport.initialize());
router.use(passport.session());

// const permitted = ["/"];

// function to hide the user form accesseing the slot

const Hidenav = (req,res,next) =>{
	let nav = [{url:"/",name:"Home"}]
	if(req.user){
	if(req.user.role =='user'){
		 nav.push({url:"/bookings",name:"Booking"})
	}else{
		nav.push({url:"/slots",name:"Slots"})
	}
	}
	if(req.isAuthenticated()){
	nav.push({url:"/logout",name:"Logout"})
	}else{
		nav.push({url:"/login",name:"Login"})
	}
	console.log(nav)
	res.locals.navigation = nav
	next();

}

// const Hidenav = (req,res,next) =>{
	
// 	if(req.user == "user"){
// 		res.locals.user = true
// 	}else{
// 		res.locals.user = false
// 	}

// 	next()
// }





// function to check number of attempt .if exceeded then block user
const Tracklogin = async (req, user) => {
	const session = req.session;
	if (!session.maxFailedAttempts) {
		session.maxFailedAttempts = 5;
	} else {
		session.maxFailedAttempts -= 1;
		const maxFailedAttempts = session.maxFailedAttempts;
		if (maxFailedAttempts <= 1) {
			user.status = false;
			await user.save();
		}
	}


	// console.log(req.session.maxFailedAttempts);
};
// function to check authentication and whitelisting
const loginAuthentication = (req, res, next) => {
	res.locals.isAuthenticated = false;
	// whitelisting
	res.locals.whitelisted = false;

	if (req.path === "/") {
		res.locals.whitelisted = true;
		if (req.isAuthenticated()) {
			res.locals.isAuthenticated = true;
		
		}
	} else {
		if (req.isAuthenticated()) {
			res.locals.isAuthenticated = true;
		
		} else {
			return res.redirect("/users/login");
		}
	}
	// res.locals.user = req.user || {};

	next();
};

// login routers

router.get("/users/login", controller.login);
// outsourcing the authication to  passport
router.post(
	"/users/login",
	// middleware
	passport.authenticate("local", {
		failureRedirect: "/users/login",
		failureFlash: true,
	}),
	controller.authenticatelogin,
);
router.use(loginAuthentication);
 router.use(Hidenav);


//  to access everything below  router.use(loginAuthentication) will have to login first
router.get("/users/profile", controller.profile);

router.get("/users/logout", controller.logout);

router.get("/users", controller.index);
router.get("/edit/:user_id", controller.edit);
router.post("/edit/:user_id", controller.update);

router.get("/add", controller.add);
router.post("/add", controller.save);

router.get("/delete", controller.getdelete);
router.post("/delete", controller.delete);

module.exports = router;
