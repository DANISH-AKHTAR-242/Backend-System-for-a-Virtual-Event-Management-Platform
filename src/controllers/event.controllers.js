const eventService = require("../services/event.service");
const {
  validateCreateEventPayload,
  validateObjectId,
} = require("../validators/event.validator");

exports.createEvent = async (req, res, next) => {
  try {
    const payload = validateCreateEventPayload(req.body);
    const event = await eventService.createEvent(payload, req.user.id);

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllEvents = async (_req, res, next) => {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json({ events });
  } catch (err) {
    next(err);
  }
};

exports.registerForEvent = async (req, res, next) => {
  try {
    const eventId = validateObjectId(req.params.eventId, "Event ID");
    const userId = validateObjectId(req.user.id, "User ID");

    const event = await eventService.registerForEvent(eventId, userId);
    res.status(200).json({
      message: "Registered for event successfully",
      event,
    });
  } catch (err) {
    next(err);
  }
};
