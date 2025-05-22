const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
const passport = require("passport");
const scopeValidation = require("../../utils/middlewares/scopeValidation");
require("../../utils/strategies/jwt");

const router = express.Router();

router.get("/", (req, res, next) => {
  controller
    .getValorPuntos()
    .then((puntos) => response.success(res, puntos, 200))
    .catch(next);
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidation(["ADMIN-ROLE", "GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .addPuntos(req.body)
      .then((puntos) => response.success(res, puntos, 201))
      .catch(next);
  }
);
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidation(["ADMIN-ROLE", "GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .updatePuntos(req.params.id, req.body)
      .then((puntos) => response.success(res, puntos, 200))
      .catch(next);
  }
);
module.exports = router;
