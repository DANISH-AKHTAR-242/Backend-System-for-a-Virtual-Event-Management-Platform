const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");
const { PORT } = require("./config/config");
const logger = require("./utils/logger");

dotenv.config();

const port = Number(PORT);

const start = async () => {
  await connectDB();

  const server = app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });

  process.on("unhandledRejection", (err) => {
    logger.error("Unhandled promise rejection", { message: err.message });
    server.close(() => process.exit(1));
  });
};

start();
