const assert = require("node:assert/strict");
const test = require("node:test");
const mongoose = require("mongoose");

const {
  validateRegistrationPayload,
  validateLoginPayload,
} = require("../src/validators/auth.validator");
const {
  validateCreateEventPayload,
  validateObjectId,
} = require("../src/validators/event.validator");
const HttpError = require("../src/utils/httpError");

test("validateRegistrationPayload normalizes values", () => {
  const payload = validateRegistrationPayload({
    name: " Test User ",
    email: "USER@example.com",
    password: "password123",
    role: "organizer",
  });

  assert.equal(payload.name, "Test User");
  assert.equal(payload.email, "user@example.com");
  assert.equal(payload.role, "organizer");
});

test("validateRegistrationPayload rejects weak password", () => {
  assert.throws(
    () =>
      validateRegistrationPayload({
        name: "User",
        email: "user@example.com",
        password: "short",
      }),
    HttpError
  );
});

test("validateLoginPayload enforces email presence", () => {
  assert.throws(() => validateLoginPayload({ password: "secret123" }), HttpError);
});

test("validateCreateEventPayload requires valid date", () => {
  assert.throws(
    () => validateCreateEventPayload({ title: "My Event", date: "invalid" }),
    HttpError
  );

  const payload = validateCreateEventPayload({
    title: "My Event",
    description: "Great event",
    date: "2025-01-01T10:00:00Z",
  });

  assert.equal(payload.title, "My Event");
  assert.equal(payload.description, "Great event");
  assert.ok(payload.date instanceof Date);
});

test("validateObjectId accepts valid identifiers", () => {
  const id = new mongoose.Types.ObjectId().toString();
  assert.equal(validateObjectId(id, "Event ID"), id);
});
