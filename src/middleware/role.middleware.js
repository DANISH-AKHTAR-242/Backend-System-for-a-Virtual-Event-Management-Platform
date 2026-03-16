const HttpError = require("../utils/httpError");

module.exports = (role) => (req, _res, next) => {
  if (!req.user) {
    return next(new HttpError(401, "Unauthorized"));
  }
  if (req.user.role !== role) {
    return next(new HttpError(403, "Forbidden"));
  }
  next();
};
