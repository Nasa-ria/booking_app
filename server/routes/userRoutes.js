// requiring exress
const express = require("express");
// requiring the appcontroller to to anble users
const controller = require("../controllers/bookingController")

// creating a variable tha holds object for declaring route within our application
const router = require("express").Router();

router.get('/',controller.index)

router.get('/login',controller.login)

router.get('/profile',controller.profile)

 router.get('/edit/:user_id',controller.edit)
router.post('/edit/:user_id',controller.update)


router.get('/add',controller.add)
router.post('/add',controller.save)

router.get('/delete',controller.getdelete)
router.post('/delete',controller.delete)

module.exports = router