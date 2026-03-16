const HttpError = require("../utils/httpError");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedRoles = ["organizer", "attendee"];

const normalizeRole = (role) =>
  allowedRoles.includes(role) ? role : "attendee";

const validateRequiredString = (value, field) => {
  if (!value || typeof value !== "string" || !value.trim()) {
    throw new HttpError(400, `${field} is required`);
  }
  return value.trim();
};

const validateEmail = (email) => {
  const normalized = validateRequiredString(email, "Email").toLowerCase();
  if (!emailPattern.test(normalized)) {
    throw new HttpError(400, "Email is invalid");
  }
  return normalized;
};

exports.validateRegistrationPayload = (body) => {
  if (!body || typeof body !== "object") {
    throw new HttpError(400, "Invalid request body");
  }

  const name = validateRequiredString(body.name, "Name");
  const email = validateEmail(body.email);
  const password = validateRequiredString(body.password, "Password");

  if (password.length < 8) {
    throw new HttpError(400, "Password must be at least 8 characters long");
  }

  return {
    name,
    email,
    password,
    role: normalizeRole(body.role),
  };
};

exports.validateLoginPayload = (body) => {
  if (!body || typeof body !== "object") {
    throw new HttpError(400, "Invalid request body");
  }

  const email = validateEmail(body.email);
  const password = validateRequiredString(body.password, "Password");

  return { email, password };
};
