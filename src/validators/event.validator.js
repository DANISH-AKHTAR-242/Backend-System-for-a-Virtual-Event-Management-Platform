const mongoose = require("mongoose");
const HttpError = require("../utils/httpError");

const validateRequiredString = (value, field) => {
  if (!value || typeof value !== "string" || !value.trim()) {
    throw new HttpError(400, `${field} is required`);
  }
  return value.trim();
};

exports.validateCreateEventPayload = (body) => {
  if (!body || typeof body !== "object") {
    throw new HttpError(400, "Invalid request body");
  }

  const title = validateRequiredString(body.title, "Title");
  const description =
    typeof body.description === "string" ? body.description.trim() : "";

  const dateValue = body.date || body.datetime;
  const date = dateValue ? new Date(dateValue) : null;

  if (!date || Number.isNaN(date.getTime())) {
    throw new HttpError(400, "A valid date is required");
  }

  return { title, description, date };
};

exports.validateObjectId = (id, field = "ID") => {
  if (!id) {
    throw new HttpError(400, `${field} is required`);
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpError(400, `${field} is invalid`);
  }
  return id;
};
