const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");
const users = require("../data/users");
const { v4: uuid } = require("uuid");

exports.registerUser = async ({ name, email, password, role }) => {
  const existing = users.find(u => u.email === email);
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = {
    id: uuid(),
    name,
    email,
    password: hashed,
    role: role || "attendee"
  };

  users.push(user);
  return user;
};

exports.loginUser = async ({ email, password }) => {
  const user = users.find(u => u.email === email);
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "4h" }
  );

  return token;
};