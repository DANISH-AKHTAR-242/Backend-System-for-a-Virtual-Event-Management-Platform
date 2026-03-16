const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const HttpError = require("../utils/httpError");
const { JWT_SECRET } = require("../config/config");

const ensureJwtSecret = () => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
};

exports.registerUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new HttpError(409, "User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

exports.loginUser = async ({ email, password }) => {
  ensureJwtSecret();

  const user = await User.findOne({ email });
  if (!user) throw new HttpError(401, "Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new HttpError(401, "Invalid credentials");

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "4h" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
