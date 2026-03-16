const Event = require("../models/Event");
const HttpError = require("../utils/httpError");

exports.createEvent = async (data, organizerId) => {
  const event = await Event.create({
    title: data.title,
    description: data.description || "",
    date: data.date,
    createdBy: organizerId,
    participants: [],
  });

  return event.toJSON();
};

exports.getAllEvents = async () => {
  const events = await Event.find()
    .sort({ date: 1 })
    .populate("createdBy", "name email role")
    .populate("participants", "name email role");

  return events.map((event) => event.toJSON());
};

exports.registerForEvent = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new HttpError(404, `Event with ID ${eventId} not found`);
  }

  if (event.participants.some((participantId) => participantId.toString() === userId)) {
    throw new HttpError(409, "User is already registered for this event");
  }

  event.participants.push(userId);
  await event.save();

  const updatedEvent = await Event.findById(eventId)
    .populate("createdBy", "name email role")
    .populate("participants", "name email role");

  return updatedEvent.toJSON();
};
