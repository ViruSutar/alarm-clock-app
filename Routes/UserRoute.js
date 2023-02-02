const express = require("express");
const router = express.Router();
const {addUsers,listUsers}  =require('../Controller/UsersController')

router.get('/getall',listUsers)
router.post('/add',addUsers)

module.exports = router;
