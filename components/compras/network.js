const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
const router = express.Router();
const passport = require("passport");
require("../../utils/strategies/jwt");
const scopeValidationsHandler = require("../../utils/middlewares/scopeValidation");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidationsHandler(["GERENTE-ROLE", "ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    controller
      .addCompra(req.body, req.user, req.headers.authorization)
      .then((datos) => response.success(res, datos))
      .catch(next);
  }
);

// registra un egreso
router.post(
  "/registrar-egreso",
  passport.authenticate("jwt", { session: false }),
  scopeValidationsHandler(["GERENTE-ROLE", "ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    controller
      .addEgreso(req.body, req.user)
      .then((datos) => response.success(res, datos))
      .catch(next);
  }
);
// obtiene una compra por ID
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidationsHandler(["GERENTE-ROLE", "ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    const id = req.params.id;
    controller
      .getCompraId(id)
      .then((compra) => response.success(res, compra))
      .catch(next);
  }
);

// obtiene las compras de un rango de fecha asignado
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidationsHandler(["GERENTE-ROLE", "ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    const fechaInicio = req.query.fechaInicio;
    const fechaFin = req.query.fechaFin;
    controller
      .getCompraFecha(fechaInicio, fechaFin)
      .then((compras) => response.success(res, compras))
      .catch(next);
  }
);

// actualiza uuna compra
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidationsHandler(["GERENTE-ROLE", "ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    controller
      .actualizarCompra(req.params.id, res.body, req.headers.authorization)
      .then((newCompra) => response.success(res, newCompra))
      .catch(next);
  }
);

// REPORTES
// Reporte para obtener todos los egresos de una sucursal
router.get(
  "/reporte/egresos/:idSucursal",
  passport.authenticate("jwt", { session: false }),
  scopeValidationsHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .getReporteEgresos(
        req.params.idSucursal,
        req.query.fechaInicio,
        req.query.fechaFin
      )
      .then((productos) => response.success(res, productos))
      .catch(next);
  }
);
module.exports = router;
