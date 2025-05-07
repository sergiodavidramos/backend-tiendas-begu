const response = require("./response");
function errors(error, req, res, next) {
  const message = error.message || "error interno";
  const status = error.statusCode || 500;

  response.error(res, message, status);
}
module.exports = errors;
