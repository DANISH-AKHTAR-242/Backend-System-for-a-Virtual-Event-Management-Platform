const express = require("express");

const auth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const asyncHandler = require("../middleware/asyncHandler");
const {
  createEvent,
  getAllEvents,
  registerForEvent,
} = require("../controllers/event.controllers");

const router = express.Router();

router.get("/", asyncHandler(getAllEvents));

router.post(
  "/",
  auth,
  requireRole("organizer"),
  asyncHandler(createEvent)
);

router.post(
  "/:eventId/register",
  auth,
  requireRole("attendee"),
  asyncHandler(registerForEvent)
);

module.exports = router;
