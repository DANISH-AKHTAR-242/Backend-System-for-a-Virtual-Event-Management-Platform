const events = require("../data/events");
const { v4: uuid } = require("uuid");

exports.createEvent = async (data, organizerId) => {
  const event = {
    id: uuid(),
    ...data,
    organizerId,
    participants: []
  };

  events.push(event);
  return event;
};

exports.getAllEvents = async () => events;

exports.registerForEvent = async (eventId, userId) => {
  const event = events.find(e => e.id === eventId);
  if (!event) throw new Error("Event not found");

  if (event.participants.includes(userId))
    throw new Error("Already registered");

  event.participants.push(userId);
  return event;
};