const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
require("../../utils/strategies/jwt");
const passport = require("passport");
const scopeValidatorHandler = require("../../utils/middlewares/scopeValidation");

const router = express.Router();

// Agrega un nuevo inventario a la sucursal
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .addNewInventario(req.body.sucursal)
      .then((data) => {
        response.success(res, data, 201);
      })
      .catch(next);
  }
);
//agrega un nuevo producto al inventario de una sucursal
router.post(
  "/nuevo/producto",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .addProductoInventario(req.body, req.headers.authorization)
      .then((det) => {
        response.success(res, det, 200);
      })
      .catch(next);
  }
);
//paginacion
router.get(
  "/productos/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .getProductosInventarioPaginate(req.params.id, req.query.pagina)
      .then((det) => {
        response.success(res, det, 200);
      })
      .catch(next);
  }
);
//obtiene un producto por ID de todos los inventarios
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    controller
      .getProductoId(req.params.id)
      .then((product) => response.success(res, product))
      .catch(next);
  }
);
// Obtiene un producto por ID de un inventario en espesifico mandando la ID la la sucursal
router.get(
  "/buscar/producto-sucursal",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    controller
      .getProductoIdInvetarioId(req.query.idProducto, req.query.idSucursal)
      .then((product) => response.success(res, product))
      .catch(next);
  }
);
// Obtiene un producto por termino de una sucursal
router.get(
  "/buscar/termino",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    controller
      .getProductoWithTermino(req.query.termino, req.query.idSucursal)
      .then((producto) => response.success(res, producto))
      .catch(next);
  }
);
// Obtiene un producto por codigo de producto de una sucursal
router.get(
  "/buscar/codigoProducto",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    controller
      .getProductWithCodigo(parseInt(req.query.code), req.query.idSucursal)
      .then((producto) => response.success(res, producto))
      .catch(next);
  }
);
//actualiza el stock una ves realizado una venta
router.patch(
  "/actualiza-stock",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    controller
      .updateStockProduct(
        req.body.idProducto,
        req.body.idSucursal,
        req.body.datos,
        req.body.venta,
        req.headers.authorization
      )
      .then((producto) => response.success(res, producto))
      .catch(next);
  }
);

// TODO REPORTES

// Reportes para hacer inventario de una sucursal
router.get(
  "/reporte/inventario/:idSucursal",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    const idSucursal = req.params.idSucursal;
    controller
      .getInventario(idSucursal)
      .then((inventario) => response.success(res, inventario))
      .catch(next);
  }
);

// Reporte de productos prontos a vencer de una sucursal
router.get(
  "/reporte/productos/caducidad/:idSucursal",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    const idSucursal = req.params.idSucursal;
    controller
      .getProductosCaducidad(idSucursal, req.query.dias)
      .then((productos) => response.success(res, productos))
      .catch(next);
  }
);

// Reporte de productos con poco stock de una sucursal
router.get(
  "/reporte/productos-poco-stock/:idSucursal",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    const idSucursal = req.params.idSucursal;
    controller
      .getProductosPocoStock(idSucursal, req.query.cantidad)
      .then((productos) => response.success(res, productos))
      .catch(next);
  }
);

module.exports = router;
