const mongoose = require('mongoose')


const connectDb = async (mongoUrl)=>{
    try {
     if(mongoUrl){
        const conn = await mongoose.connect(mongoUrl, {
            autoIndex: true, // Don't build indexes
            maxPoolSize: 100, // Maintain up to 200 socket connections
            minPoolSize: 10,
            serverSelectionTimeoutMS: 30000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 
          })

       mongoose.set('debug', true);
       mongoose.set('strictQuery', true);
       console.log(`mongoDB connected:${conn.connection.host}`);
     }

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports  = connectDb
