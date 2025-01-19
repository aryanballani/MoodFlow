// server/src/config/database.js
const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    const conn = await mongoose.connect(uri, {
      // These options help avoid deprecation warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

