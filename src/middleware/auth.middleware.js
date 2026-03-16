const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config/config");
const HttpError = require("../utils/httpError");

module.exports = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new HttpError(401, "Unauthorized"));
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    next(new HttpError(401, "Invalid token"));
  }
};
