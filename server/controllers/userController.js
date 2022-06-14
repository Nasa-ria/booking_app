require("../models/mongooseConnection");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const Util = require("./functions");

exports.index = async (req, res) => {
	const authorizatedRoles = ["admin"];
	Util.authorization(req, res, authorizatedRoles);
	const users = await User.find({});
	res.render("users/index", { title: "Users", users });
};

exports.login = async (req, res) => {
	const message = req.flash().error;
	res.locals.csrfToken = req.csrfToken();
	res.render("users/login", { title: "login-formn", message });
};

exports.authenticatelogin = async (req, res) => {
	res.redirect(302, "/");
};

exports.profile = async (req, res) => {
	res.render("users/profile", { title: "Users-profile" });
};

exports.logout = async (req, res) => {
	// res.local.csrfToken = req.csrfToken();
	req.logout();
	res.redirect(302, "/users/login");
};

exports.edit = async (req, res) => {
	const authorizatedRoles = ["admin"];
	Util.authorization(req, res, authorizatedRoles);
	res.locals.csrfToken = req.csrfToken();
	const user = await User.findById(req.params.id);
	res.render("users/edit", { title: "User Form", user });
};
exports.update = async (req, res) => {
	const hashedPassword = await bcrypt.hash(req.body.password, 10);
	const user = await User.updateOne(
		{ _id: req.params.id },
		{
			name: req.body.name,
			phone_number: req.body.phone_number,
			password: hashedPassword,
			password: req.body.password
		},
	);
	res.redirect(302, "/users");
};

exports.add = async (req, res) => {
	const authorizatedRoles = ["admin"];
	Util.authorization(req, res, authorizatedRoles);
	res.locals.csrfToken = req.csrfToken();
	res.render("users/add", { title: "User From" });
};
exports.save = async (req, res) => {
	const hashedPassword = await bcrypt.hash(req.body.password, 10);
	const user = new User({
		name: req.body.name,
		phone_number: req.body.phone_number,
		password:req.body.password,
		password: hashedPassword,
		role: "admin",
	});
	await user.save();
	res.redirect(302, "/users");
};

exports.getdelete = async (req, res) => {
	const authorizatedRoles = ["admin"];
	Util.authorization(req, res, authorizatedRoles);
	res.locals.csrfToken = req.csrfToken();
	const user = await User.findById(req.params.id);
	res.render("users/delete", { title: "User Form", user });
};
exports.delete = async (req, res) => {
	const user = await User.deleteOne({ _id: req.params.id });
	res.redirect(302, "/users");
};

exports.change = async (req, res) => {
	res.locals.csrfToken = req.csrfToken();
	res.render("users/change", {
		title: "change-password",
		activeNav: "profile",
		forcePassword: 0,
	});
};
exports.savechange = async (req, res) => {
	console.log("save change")
	res.locals.csrfToken = req.csrfToken();
	const message = req.flash().error;
	let initialpassword = await bcrypt.compare(req.body.current_password,req.user.password);
	if (initialpassword) {
        if(req.body.new_password === req.body.confirm_password){
            try {
                const newhashed = await bcrypt.hash(req.body.new_password, 10);
                const user = await User.findById(req.user._id);
                user.password = newhashed
                user.force_change_password = false;
                await user.save()
              
                // await User.updateOne( { _id: req.user._id }, { password: newhashed, force_change_password: false });
                req.user.force_change_password =false;
                return res.redirect(302, "/users/profile");
                
            } catch (error) {
                console.error(error)
               res.locals.message="password could not save ,try again later"
            }
    
		
	} else {
		res.render("users/change", {message: "incorrect current password",title: "change-password"});
         
	}
} else {
    res.render("users/change", {message: "incorrect current password",title: "change-password"});
     
}
}

exports.forcepassword = async (req, res) => {
	
	const authorizatedRoles = ["admin"];
	Util.authorization(req, res, authorizatedRoles);
	res.locals.csrfToken = req.csrfToken();
	res.render("users/force-password", { title: "force-change" });
};
exports.saveforcepassword= async (req, res) => {
    console.log(req.body)
      if(req.body.password_action == "forcePassword" ){
		  const user = await User.updateOne({_id:req.params.id},{force_change_password:true})
		  res.redirect(302, "/users");
        //   console.log("change password")
          
      }else if(req.body.password_action == "resetPassword"){
		const newhashed = await bcrypt.hash(req.body.resetPassword, 10);
          const user = await User.updateOne({_id:req.params.id},{password:newhashed,force_change_password:false})
		  res.redirect(302, "/users");
        //  console.log("reset passwrod") 
      }

	
	res.redirect(302, "/users");
};

exports.forgetPassword = async (req,res)=>{
	res.locals.csrfToken = req.csrfToken();
const user = await User.find({})
	res.render("users/forget_password",{title:"forget password",user})
}
exports.confirmPassword = async(req,res)=>{
	const user = await User.findOne({phone_number:req.body.phone_number})
	if(user){
	

		const result = Math.random().toString(36).substring(2,7);

		const hashed = await bcrypt.hash( result, 10);
		user.password = hashed
		user.force_change_password = true;
		await user.save()
		
		res.render("users/password_confirm",{title:"confirm password", result})
	    

	}else{
		res.locals.message= "incorrect phone_number"
		res.render("users/forget-password",{title:"forget password"})
    
	}
	
}
