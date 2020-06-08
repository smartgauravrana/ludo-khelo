const { ErrorResponse } = require("../utils");
module.exports = (isAdmin = false) => (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse("Unauhorised", 401));
  }
  if (isAdmin && !req.user.isAdmin) {
    return next(new ErrorResponse("Unauhorised", 401));
  }
  next();
};
