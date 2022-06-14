// requiring exress
const express = require("express");
// requiring the appcontroller to to anble users
const controller = require("../controllers/bookingController")

// creating a variable tha holds object for declaring route within our application
const router = require("express").Router();

router.get('/',controller.index)


// add
router.get('/add/:id',controller.add)
router.post('/add/:id',controller.save)


// edit
router.get('/edit', controller.edit);
router.post('/edit',controller.update)


// delete
router.get('/delete', controller.getdelete);
router.post('/delete',controller.delete)


// user
router.post('/update_user',controller.updateUser)


module.exports = router;