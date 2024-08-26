const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("mongoDB Connected");
    }catch (error){
        console.error('MongoDB connection Failed', error.message);
    }
};

module.exports = connectDB;