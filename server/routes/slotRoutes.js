// requiring exress
const express = require("express");



// requiring the appcontroller to to anble users
const controller = require("../controllers/slotsController")

// creating a variable tha holds object for declaring route within our application
const router = require("express").Router();




router.get('/' ,controller.index)

router.get('/book/:id',controller.book)
router.post('/book/:id',controller.save_book)

// user
router.post('/update-user',controller.updateUser)

// add
router.get('/add', controller.add);
router.post('/add',controller.save)

// edit
router.get('/edit', controller.edit);
router.post('/edit',controller.update)


// delete
router.get('/delete', controller.getdelete);
router.post('/delete',controller.delete)



module.exports = router;