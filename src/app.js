require ('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const errorHandler = require("./middleware/error.middleware");
const rateLimiter = require("./middleware/rateLimit.middleware");
const notFound = require("./middleware/notFound.middleware");

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(rateLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
