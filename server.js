const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDb = require("./Config/db");
dotenv.config({ path: "./.env" });

const mongoUrl = process.env.MONGO_URL;


app.use(express.json());

// database
connectDb(mongoUrl);

// Routes
app.use('/alarm',require('./Routes/AlarmRoute'))
app.use('/user',require('./Routes/UserRoute'))


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Alarm clock app listening on port ${PORT}`);
});
