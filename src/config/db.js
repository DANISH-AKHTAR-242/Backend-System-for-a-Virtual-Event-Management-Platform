const mongoose = require("mongoose");

const { MONGO_URI, NODE_ENV } = require("./config");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info(`MongoDB connected (${NODE_ENV})`);
  } catch (error) {
    logger.error("Failed to connect to MongoDB", { message: error.message });
    process.exit(1);
  }
};

module.exports = connectDB;
