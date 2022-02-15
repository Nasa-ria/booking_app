// requiring exress
const express = require("express");
// requiring the appcontroller to to anble users
const controller = require("../controllers/userController")
const passport = require("passport")
const LocalStrategy = require ("passport-local")


// creating a variable tha holds object for declaring route within our application
const router = require("express").Router();

passport.use(
    new LocalStrategy(function verify(username,password,cd){
        const user ={};
        return cb(null,user)
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



router.get('/',controller.index)

router.get('/login',controller.login)
// outsourcing the authication to  passport
router.post('/login',
// middleware
passport.authenticate("local",{failureRedirect:"/login"}),
controller.authenticatelogin
)


router.get('/profile',controller.profile)


 router.get('/edit/:user_id',controller.edit)
router.post('/edit/:user_id',controller.update)


router.get('/add',controller.add)
router.post('/add',controller.save)

router.get('/delete',controller.getdelete)
router.post('/delete',controller.delete)

module.exports = router