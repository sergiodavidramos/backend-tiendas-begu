const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
require("../../utils/strategies/jwt");
const passport = require("passport");
const scopeValidationHandler = require("../../utils/middlewares/scopeValidation");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler([
    "GERENTE-ROLE",
    "ADMIN-ROLE",
    "CLIENT-ROLE",
    "USER-ROLE",
    "DELIVERY-ROLE",
  ]),
  (req, res, next) => {
    controller
      .addDetalle(req.body.detalle, req.body.venta)
      .then((det) => {
        response.success(res, det);
      })
      .catch(next);
  }
);

router.get("/:id", (req, res, next) => {
  controller
    .getDetalle(req.params.id)
    .then((det) => response.success(res, det))
    .catch(next);
});

// REPORTES

// Reporte para obtener los productos mas vendidos de una sucursal con el margen de ganancia
router.get(
  "/reporte/productos-mas-vendidos/:idSucursal",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .getProductosVendidos(
        req.params.idSucursal,
        req.query.fechaInicio,
        req.query.fechaFin
      )
      .then((productos) => response.success(res, productos))
      .catch(next);
  }
);

// reportes de la cantidad de ventas y pedidos del dia y el total
router.get(
  "/reporte/ventas-dia/:idSucursal",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .getVentasDia(req.params.idSucursal)
      .then((ventas) => response.success(res, ventas))
      .catch(next);
  }
);
// reportes de la cantidad de ventas y pedidos del mes y el total
router.get(
  "/reporte/ventas-mes/:idSucursal",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .getVentasMes(req.params.idSucursal, req.query.añoAnterior)
      .then((ventas) => response.success(res, ventas))
      .catch(next);
  }
);
// reportes de la cantidad de ventas y pedidos de cada sucursal
router.get(
  "/reporte/ventas-sucursales",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .getVentasSucursales()
      .then((ventas) => response.success(res, ventas))
      .catch(next);
  }
);

// Reporte para obtener todos los ingresos de una sucursal con rango de fechas
router.get(
  "/reporte/ingresos/:idSucursal",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .getIngresos(
        req.params.idSucursal,
        req.query.fechaInicio,
        req.query.fechaFin
      )
      .then((productos) => response.success(res, productos))
      .catch(next);
  }
);

module.exports = router;
