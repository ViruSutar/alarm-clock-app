const Alarm = require("../Models/Alarm");
const moment = require("moment");
const cron = require("node-cron");
const player = require("play-sound")((opts = {}));

class AlarmController {
  static async createAlarm(req, res) {
    const { alarmTime, alarmName, userId } = req.body;
   

    const timeFormat = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;


    if (!timeFormat.test(alarmTime)) {
      return res
        .status(400)
        .send({success:false, message: "Invalid time format. Expected format: HH:MM" });
    }

    if(!userId){
      return res
        .status(400)
        .send({success:false, message: "userId reuired" });
    }

    let currentTime = moment(new Date(), "HH:mm:ss").format("HH:mm");
    let AlarmDate = moment(new Date()).format("YYYY-MM-DD");

    if (currentTime.split(":")[0] > alarmTime.split(":")[0]) {
      return res.status(400).json({
        success: false,
        message: "Please set alarm after current time",
      });
    }

    if(currentTime.split(":")[0] === alarmTime.split(":")[0] && currentTime.split(":")[1] >= alarmTime.split(":")[1]){
      return res.status(400).json({
        success: false,
        message: "Please set alarm after current time",
      });
    }

    if (
      currentTime.split(":")[0] === alarmTime.split(":")[0] &&
      currentTime.split(":")[1] > alarmTime.split(":")[1]
    ) {
      return res.status(400).json({
        success: false,
        message: "Please set alarm after current time",
      });
    }

    await Alarm.create({
      alarmName,
      alarmTime,
      userId,
    });

    cron.schedule("* * * * *", () => {
      console.log("running a task every minute");
      AlarmController.fetchCurrentAlarms(alarmTime, AlarmDate,alarmName);
    });

    return res
      .status(200)
      .json({ success: true, message: "Alarm created successfully" });
  }

  static async updateAlarm(req, res) {
    const { alarmId, alarmTime, alarmName } = req.body;

    const alarm = await Alarm.findOne({ _id: alarmId });
    let AlarmDate = moment(alarm.createdAt).format("YYYY-MM-DD");
    const timeFormat = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    let currentTime = moment(new Date(), "HH:mm:ss").format("HH:mm");

    if (!alarm) {
      return res
        .status(400)
        .json({ success: false, message: "Alarm not found" });
    }


    if (!timeFormat.test(alarmTime)) {
      return res
        .status(400)
        .send({ error: "Invalid time format. Expected format: HH:MM" });
    }

    // check minutes too 
    if (currentTime.split(":")[0] > alarmTime.split(":")[0]) {
      return res.status(400).json({
        success: false,
        message: "Please set alarm after current time",
      });
    }

    if(currentTime.split(":")[0] === alarmTime.split(":")[0] && currentTime.split(":")[1] >= alarmTime.split(":")[1]){
      return res.status(400).json({
        success: false,
        message: "Please set alarm after current time",
      });
    }

    if (alarmTime) alarm.alarmTime = alarmTime;
    if (alarmName) alarm.alarmName = alarmName;
    alarm.save();

    // you need to run cron job here also
    cron.schedule("* * * * *", () => {
      console.log("running a task every minute");
      AlarmController.fetchCurrentAlarms(alarmTime, AlarmDate,alarm.alarmName);
    });

    return res
      .status(200)
      .json({ success: true, message: "Alarm updated successfully" });
  }

  static async getCurrentTime(req, res) {
    let currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();

    let time = `${hours}:${minutes}:${seconds}`;
    res.status(200).json({success:true,time:`The current time is: ${time}`});
  }

  static async listAlarms(req, res) {
    const { userId } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId required" });
    }
    const alarms = await Alarm.find({ userId }, { alarmTime: 1, alarmName: 1 });

    return res.status(200).json({ success: true, alarms });
  }

  static async deleteAlarm(req, res) {
    const { alarmId } = req.body;

    const alarm = await Alarm.findOne({ _id: alarmId });

    if (!alarm) {
      return res
        .status(400)
        .json({ success: false, message: "Alarm not found" });
    }
    await Alarm.deleteOne({ _id: alarmId });

    return res
      .status(200)
      .json({ success: true, message: "Alarm deleted successfully" });
  }

  static async fetchCurrentAlarms(alarmTime, AlarmDate,alarmName) {

    let currentTime = moment(new Date(), "HH:mm:ss").format("HH:mm");
    let currentDate = moment(new Date()).format("YYYY-MM-DD");

    let isDateMatch = moment(currentDate).isSame(AlarmDate);
    let isHourMatch = currentTime.split(":")[0] === alarmTime.split(":")[0];
    let isMinuteMatch = currentTime.split(":")[1] === alarmTime.split(":")[1];

    if (isDateMatch && isHourMatch && isMinuteMatch) {
      AlarmController.ringAlarm(alarmName);
    }

    return;
  }

  static async ringAlarm(alarmName) {
    player.play("./Files/sample.mp3", function (err) {
      if (err) {
        throw console.log(err);
      }

      console.log(alarmName);
    });

    return;
  }
}

module.exports = AlarmController;
