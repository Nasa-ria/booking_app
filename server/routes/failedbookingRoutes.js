// requiring exress
const express = require("express");
// requiring the appcontroller to to anble users
const controller = require("../controllers/failedbookingController")

// creating a variable tha holds object for declaring route within our application
const router = require("express").Router();

router.get('/',controller.index)


module.exports =router;