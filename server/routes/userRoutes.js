// requiring exress
const express = require("express");
const passport = require("passport")
const LocalStrategy = require ("passport-local")

// requiring the appcontroller to to enable users
const controller = require("../controllers/userController")
const User = require ("../models/User")



// creating a variable tha holds object for declaring route within our application
const router = require("express").Router();

passport.use(
    new LocalStrategy(async function verify(username,password,cb){
        // checks if the phone number inputed  matches 
      const user = await User.findOne({phone_number:username})
      if(user){
        //   and the password too
         if(user.password === password)
         return cb(null,user)  /* verification succesfull */
         } 
          
         return cb(null , false); /* verification failed */
        
     
    })
);

passport.serializeUser(function(user,cb){
    return cb(null,user)
});

passport.deserializeUser(function(user,cb){
    return cb(null,user)
});

router.use(passport.initialize());
router.use(passport.session());


const loginAuthentication = (req,res,next) =>{
    res.locals.isAuthenticated = false;
    if(req.isAuthenticated()){
        res.locals.isAuthenticated = true;
        next()
    }else{
        res.redirect('/users/login')
    }
}




// login routers

router.get('/users/login',controller.login)
// outsourcing the authication to  passport
router.post('/users/login',
// middleware
passport.authenticate("local",{failureRedirect:"/users/login"}),
controller.authenticatelogin
)


router.use(loginAuthentication)

router.get('/users/profile',controller.profile)



router.get('/users',controller.index)
 router.get('/edit/:user_id',controller.edit)
router.post('/edit/:user_id',controller.update)


router.get('/add',controller.add)
router.post('/add',controller.save)

router.get('/delete',controller.getdelete)
router.post('/delete',controller.delete)

module.exports = router