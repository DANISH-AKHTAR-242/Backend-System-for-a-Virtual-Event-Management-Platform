const express = require("express");

const auth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const {
  createEvent,
  getAllEvents,
  registerForEvent,
} = require("../controllers/event.controllers");

const router = express.Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const events = await getAllEvents();
    res.status(200).json({ events });
  })
);

router.post(
  "/",
  auth,
  requireRole("organizer"),
  asyncHandler(async (req, res) => {
    const event = await createEvent(req.body, req.user.id);
    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  })
);

router.post(
  "/:eventId/register",
  auth,
  requireRole("attendee"),
  asyncHandler(async (req, res) => {
    const event = await registerForEvent(req.params.eventId, req.user.id);
    res.status(200).json({
      message: "Registered for event successfully",
      event,
    });
  })
);

module.exports = router;
