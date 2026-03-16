const dotenv = require("dotenv");

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";

const requiredVars = ["JWT_SECRET", "MONGO_URI"];
const missingVars = requiredVars.filter(
  (key) => !process.env[key] && NODE_ENV !== "test"
);

if (missingVars.length) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
}

const PORT = Number(process.env.PORT || 3000);

if (Number.isNaN(PORT)) {
  throw new Error("PORT must be a valid number");
}

module.exports = {
  NODE_ENV,
  PORT,
  JWT_SECRET: process.env.JWT_SECRET || "test-secret",
  MONGO_URI:
    process.env.MONGO_URI || "mongodb://localhost:27017/virtual-events",
};
