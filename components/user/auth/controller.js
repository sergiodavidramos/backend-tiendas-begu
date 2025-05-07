const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();
require("../../../utils/strategies/basic");
function login(req, res, next) {
  return new Promise((resolve, reject) => {
    passport.authenticate("basic", function (err, user) {
      if (err || !user) {
        return reject({
          message: "Datos incorrectos por favor intentelo nuevamente",
        });
      }
      req.login(user, { session: false }, function (error) {
        if (error) {
          return reject({ message: error });
        }
        const token = generaToken(user);
        return resolve({
          token,
          usuario: user,
        });
      });
    })(req, res, next);
  });
}

function generaToken(payload) {
  const usuario = {
    nombre_comp: payload.nombre_comp,
    email: payload.email,
  };
  return jwt.sign(usuario, process.env.AUTH_JWT_SECRET, {
    expiresIn: "180d",
  });
}

module.exports = {
  login,
};
