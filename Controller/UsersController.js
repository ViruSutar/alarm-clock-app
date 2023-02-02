const User = require("../Models/User")

class UsersController{
 
static async addUsers(req,res){

    await User.insertMany([
        {name:"viraj"},
        {name:"john"},
        {name:"jayesh"}
    ])



    return res.status(200).send('users created successfully')
}

static async listUsers(req,res){
 
const users = await User.find({},{name:1})

if(!users){
    return res.status(400).json({success:false,message:"Users not found"})
}

return res.status(200).json({success:true,users})

}
}

module.exports = UsersController