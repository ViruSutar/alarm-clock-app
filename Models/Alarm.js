const mongoose=require('mongoose');

const AlarmSchema = new mongoose.Schema({
    alarmTime:{type:String},
    alarmName:{type:String,default:"WakeUp"},
    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'users',require:true},
    createdAt: { type: Date, immutable: true, default: () => new Date() },
    updatedAt: { type: Date, default: new Date() }
})

module.exports=mongoose.model('alarms',AlarmSchema);
    