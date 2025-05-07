const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
const passport = require("passport");
const scopeValidation = require("../../utils/middlewares/scopeValidation");
require("../../utils/strategies/jwt");

const router = express.Router();
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidation(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .copiaSeguridad(req.query.restaurar)
      .then((file) => {
        if (file.solucion === 1) {
          response.success(res, file);
        } else {
          res.sendFile(file.path);
        }
      })
      .catch(next);
  }
);

module.exports = router;
