const mongoose = require("mongoose");
const mongoUri = process.env.MONGO_URI;

async function connect() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Could not connect to MongoDB");
    throw error;
  }
}

module.exports = connect;
