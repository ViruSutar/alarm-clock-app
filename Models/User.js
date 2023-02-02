const mongoose=require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{type:String},
    createdAt: { type: Date, immutable: true, default: () => new Date() },
    updatedAt: { type: Date, default: new Date() }
})


module.exports=mongoose.model('users',UserSchema);
    