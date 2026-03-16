const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser
} = require("../controllers/auth.controllers");
const asyncHandler = require("../middleware/asyncHandler");

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));

module.exports = router;
