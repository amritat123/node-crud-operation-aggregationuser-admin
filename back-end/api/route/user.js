const express = require("express");
const router = express.Router();
const Controller = require("../controller/user");

router.post('/registerUser' , Controller.registerUser);
router.post('/loginUser', Controller.loginUser);
router.get('/getUser', Controller.getAllUser);
router.get('/getUserDetails', Controller.getUserDetails);
router.get('/getAllUser', Controller.getAllUser);
router.patch('/updateUser',Controller.updateUser);

module.exports = router;