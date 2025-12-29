// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // .env file se link lekar connect karne ki koshish
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Agar fail hua to process band kar do
    }
};

module.exports = connectDB;