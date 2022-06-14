// requiring exress
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require('bcrypt')
// requiring the appcontroller to to enable users
const controller = require("../controllers/userController");
const User = require("../models/User");
// creating a variable tha holds object for declaring route within our application
const router = require("express").Router();

passport.use(
	new LocalStrategy({ passReqToCallback: true }, async function verify(req,username,password,cb) {
		// checks if the phone number inputed  matches
		const user = await User.findOne({ phone_number: username });
        // console.log(user)
		if (user) {
			//   user attempt
			if (user.status) {
				const passwordVerified = await bcrypt.compare(password ,user.password)
				//   and the password too
				if(passwordVerified){
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
	let nav = [{url:"/",name:"Home",active:"home"},{url:"/bookings",name:"Book Us"}]
	if(req.user){
	if(req.user.role =='user'){
		 nav.push({url:"/bookings",name:"Booking",active:"booking"})
	}else{
		let Adminnav= [{url:"/slots",name:"Slots",active:"slot"},{url:"/users",name:"Users",active:"user"},{url:"/bookings",name:"Booking",active:"booking"}]
		nav = nav.concat(Adminnav)
	}
	}
	if(req.isAuthenticated()){
	nav.push({url:"/users/logout",name:"Logout"},{url:"/users/profile",name:"Profile",active:"profile"})
	}else{
		nav.push({url:"/users/login",name:"Login"})
	}
	
	res.locals.navigation = nav
	next();

}


const enforcePasswordChange= async(req,res,next)=>{
	res.locals.csrfToken = req.csrfToken()
	// console.log(req.user)
	
	if(typeof req.body.forcePassword === "undefined"){
		console.log( req.body.forcePassword )
		if(req.isAuthenticated() && req.user.force_change_password){
		
			// res.locals.forcePassword =1
			// const enforcepassword = req.user.force_change_password
			return res.render("users/change",{title:"change-password" ,forcePassword:1})
		}else{
		next()
	   }
	}else{ 
	
            next()
	}
	

}





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
      
router.get("/users/forget-password",controller.forgetPassword)
router.post("/users/forget-password",controller.confirmPassword)


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


router.use(loginAuthentication)


router.use(enforcePasswordChange)
 router.use(Hidenav);


//  to access everything below  router.use(loginAuthentication) will have to login first
router.get("/users/profile", controller.profile);

router.get("/users/logout", controller.logout);

router.get("/users/change-password",controller.change);
router.post("/users/change-password",controller.savechange)

router.get("/users/force-password/:id",controller.forcepassword)
router.post("/users/force-password/:id",controller.saveforcepassword)



router.get("/users", controller.index);
router.get("/users/edit/:id", controller.edit);
router.post("/users/edit/:id", controller.update);

router.get("/users/add", controller.add);
router.post("/users/add", controller.save);

router.get("/users/delete/:id", controller.getdelete);
router.post("/users/delete/:id", controller.delete);

module.exports = router;
