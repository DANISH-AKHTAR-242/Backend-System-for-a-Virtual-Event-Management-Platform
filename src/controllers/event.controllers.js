const Event = require("../models/Event");
const mongoose = require("mongoose");

/**
 * Create a new event
 * @param {Object} data - Event data (title, description, date, etc.)
 * @param {string} organizerId - ID of the event organizer
 * @returns {Object} Created event object
 * @throws {Error} If data is invalid or organizerId is missing
 */
exports.createEvent = async (data, organizerId) => {
  if (!data || typeof data !== "object") {
    const err = new Error("Invalid event data provided");
    err.statusCode = 400;
    throw err;
  }
  if (!organizerId) {
    const err = new Error("Organizer ID is required");
    err.statusCode = 400;
    throw err;
  }
  if (!data.title || !data.date) {
    const err = new Error("Title and date are required");
    err.statusCode = 400;
    throw err;
  }
  if (!mongoose.Types.ObjectId.isValid(organizerId)) {
    const err = new Error("Invalid organizer ID");
    err.statusCode = 400;
    throw err;
  }

  const event = await Event.create({
    title: data.title,
    description: data.description || "",
    date: new Date(data.date),
    createdBy: organizerId,
    participants: [],
  });
  return event.toJSON();
};

/**
 * Retrieve all events
 * @returns {Array} Array of all events
 */
exports.getAllEvents = async () => {
  const events = await Event.find()
    .sort({ date: 1 })
    .populate("createdBy", "name email role")
    .populate("participants", "name email role");

  return events.map((event) => event.toJSON());
};

/**
 * Register a user for an event
 * @param {string} eventId - ID of the event
 * @param {string} userId - ID of the user registering
 * @returns {Object} Updated event object
 * @throws {Error} If event not found or user already registered
 */
exports.registerForEvent = async (eventId, userId) => {
  if (!eventId || !userId) {
    const err = new Error("Event ID and User ID are required");
    err.statusCode = 400;
    throw err;
  }
  if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error("Invalid event ID or user ID");
    err.statusCode = 400;
    throw err;
  }

  const event = await Event.findById(eventId);
  if (!event) {
    const err = new Error(`Event with ID ${eventId} not found`);
    err.statusCode = 404;
    throw err;
  }

  if (event.participants.some((participantId) => participantId.toString() === userId)) {
    const err = new Error("User is already registered for this event");
    err.statusCode = 409;
    throw err;
  }

  event.participants.push(userId);
  await event.save();

  const updatedEvent = await Event.findById(eventId)
    .populate("createdBy", "name email role")
    .populate("participants", "name email role");

  return updatedEvent.toJSON();
};
