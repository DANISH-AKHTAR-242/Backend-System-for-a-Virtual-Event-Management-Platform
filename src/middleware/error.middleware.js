const logger = require("../utils/logger");
const { NODE_ENV } = require("../config/config");

module.exports = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (statusCode >= 500) {
    logger.error(message, { stack: err.stack });
  } else {
    logger.warn(message);
  }

  const payload = { message };
  if (NODE_ENV === "development") {
    payload.details = err.stack;
  }

  res.status(statusCode).json(payload);
};
