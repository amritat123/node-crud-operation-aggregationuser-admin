const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin");

router.post('/createAdmin' , adminController.createAdmin);
router.get('/getAllAdmin', adminController.getAllAdmin);

module.exports = router;
