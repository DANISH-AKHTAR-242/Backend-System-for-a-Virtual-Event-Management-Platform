const authService = require("../services/auth.service");
const {
  validateRegistrationPayload,
  validateLoginPayload,
} = require("../validators/auth.validator");

const registerUser = async (req, res, next) => {
  try {
    const payload = validateRegistrationPayload(req.body);
    const user = await authService.registerUser(payload);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const credentials = validateLoginPayload(req.body);
    const { token, user } = await authService.loginUser(credentials);

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser };
