require ('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const errorHandler = require("./middleware/error.middleware");
const rateLimiter = require("./middleware/rateLimit.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(rateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.use(errorHandler);

module.exports = app;