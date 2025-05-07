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
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE", "ALMACEN-ROLE"]),
  (req, res, next) => {
    controller
      .addMovimiento(req.body, req.user)
      .then((data) => response.success(res, data))
      .catch(next);
  }
);

router.get(
  "/pendientes/:idSucursal",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE", "ALMACEN-ROLE"]),
  (req, res, next) => {
    controller
      .movimientosPendientes(req.params.idSucursal)
      .then((data) => response.success(res, data))
      .catch(next);
  }
);

router.patch(
  "/confirmar-movimiento/:idMovimiento",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE", "ALMACEN-ROLE"]),
  (req, res, next) => {
    controller
      .confirmarMovimiento(
        req.params.idMovimiento,
        req.body,
        req.user,
        req.headers.authorization
      )
      .then((data) => response.success(res, data))
      .catch(next);
  }
);

// REPORTES
// Reporte de traslado de productos
router.get(
  "/reporte/movimiento/:idSucursal",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .getMovimientos(
        req.params.idSucursal,
        req.query.fechaInicio,
        req.query.fechaFin
      )
      .then((mivimientos) => response.success(res, mivimientos))
      .catch(next);
  }
);
module.exports = router;
