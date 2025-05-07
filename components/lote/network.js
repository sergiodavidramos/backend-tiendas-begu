const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
require("../../utils/strategies/jwt");
const passport = require("passport");
const scopeValidatorHandler = require("../../utils/middlewares/scopeValidation");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    controller
      .addLote(req.body)
      .then((data) => response.success(res, data))
      .catch(next);
  }
);
router.get(
  "/buscar/:numero",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    controller
      .buscarLoteNumero(req.params.numero)
      .then((data) => response.success(res, data))
      .catch(next);
  }
);
router.patch(
  "/actualizar/stock/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    controller
      .actualizarStock(req.params.id, req.body.stock)
      .then((data) => response.success(res, data))
      .catch(next);
  }
);
module.exports = router;
