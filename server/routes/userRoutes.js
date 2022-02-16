// requiring exress
const express = require("express");
// requiring the appcontroller to to anble users
const controller = require("../controllers/userController")
const User = require ("../models/User")
const passport = require("passport")
const LocalStrategy = require ("passport-local")


// creating a variable tha holds object for declaring route within our application
const router = require("express").Router();

passport.use(
    new LocalStrategy(async function verify(username,password,cb){
      const user = await User.findOne({phone_number :username})
      if(user){
         if(user.password === password)
         return cb(null,user)  /* verification succesfull */
         } 
          
         return cb(null , false); /* verification failed */
        
     
    })
);

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user,cd){
    return cd(null,user)
});

passport.deserializeUser(function(user,cd){
    return cd(null,user)
});

// const authenticate =(req,res,next) =>{
//     res.locals.isAuthenticated = false;
//     if(req.isAuthenticated()){
//         res.locals.isAuthenticated = true;
//         next()
//     }else{
//         res.redirect('/login')
//     }
// }


// login routers

router.get('/login',controller.login)
// outsourcing the authication to  passport
router.post('/login',
// middleware
passport.authenticate("local",{failureRedirect:"/users/login"}),
controller.authenticatelogin
)
router.get('/profile',controller.profile)
// router.use(authenticate)



router.get('/',controller.index)
 router.get('/edit/:user_id',controller.edit)
router.post('/edit/:user_id',controller.update)


router.get('/add',controller.add)
router.post('/add',controller.save)

router.get('/delete',controller.getdelete)
router.post('/delete',controller.delete)

module.exports = router