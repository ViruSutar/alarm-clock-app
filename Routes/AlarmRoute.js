const express = require("express");
const router = express.Router();
const {listAlarms, createAlarm, updateAlarm, deleteAlarm, getCurrentTime} = require('../Controller/AlarmsController')

router.get('/get',listAlarms)
router.post('/setAlarm',createAlarm)
router.patch('/update',updateAlarm)
router.delete('/delete',deleteAlarm)
router.get('/currentTime',getCurrentTime)

module.exports = router;
