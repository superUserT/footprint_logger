const mongoose = require("mongoose");
require("dotenv").config();
const { errorMessages, authMessages } = require("../utils/helper_objects.js");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(`${authMessages.DatabaseConnected}: ${conn.connection.host}`);
  } catch (error) {
    console.error(errorMessages.ConnectionError, error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
