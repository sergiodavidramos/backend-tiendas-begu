const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
const router = express.Router();
const passport = require("passport");
require("../../utils/strategies/jwt");
const scopeValidationHandler = require("../../utils/middlewares/scopeValidation");

// obtiene una venta por Id
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler(["GERENTE-ROLE", "ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    const id = req.params.id;
    controller
      .getVentaId(id)
      .then((venta) => response.success(res, venta, 200))
      .catch(next);
  }
);

// Obtiene los pedidos de un rango de fecha asignado filtrando por en estado de la venta
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler(["GERENTE-ROLE", "ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    const fechaInicio = req.query.fechaInicio;
    const fechaFin = req.query.fechaFin;
    controller
      .getVentaFecha(fechaInicio, fechaFin)
      .then((ventas) => response.success(res, ventas, 200))
      .catch(next);
  }
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler(["GERENTE-ROLE", "ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    controller
      .addVenta(req.body, req.user, req.headers.authorization, res)
      .then((stream) => {
        return response.pdf(res, stream);
      })
      .catch(next);
  }
);
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .actualizarVenta(req.params.id, req.body, req.headers.authorization)
      .then((nuevaVenta) => response.success(res, nuevaVenta))
      .catch(next);
  }
);

// Todo REPORTES
// reporte para obtener cantidad de ventas presenciales los año
router.get(
  "/reporte/venta-presencial/:idSucursal",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    const idSucursal = req.params.idSucursal;
    controller
      .getCantidadVentas(idSucursal)
      .then((pedidos) => response.success(res, pedidos))
      .catch(next);
  }
);
module.exports = router;
