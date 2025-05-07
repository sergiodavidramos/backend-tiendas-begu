const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
const passport = require("passport");
const scopeValidation = require("../../utils/middlewares/scopeValidation");
require("../../utils/strategies/jwt");

require("dotenv").config();

const router = express.Router();

router.get("/", (req, res, next) => {
  const id = req.query.id || null;
  controller
    .getFilterIdAndPaginateProduct(
      id,
      req.query.desde,
      req.query.limite,
      req.query.orden
    )
    .then((product) => response.success(res, product, 200))
    .catch(next);
});
router.get(
  "/codigoproducto",
  passport.authenticate("jwt", { session: false }),
  scopeValidation(["ADMIN-ROLE", "USER-ROLE", "GERENTE-ROLE", "ALMACEN-ROLE"]),
  (req, res, next) => {
    const code = req.query.code || null;
    controller
      .findForCode(parseInt(code))
      .then((product) => response.success(res, product, 200))
      .catch(next);
  }
);

router.get("/all", (req, res, next) => {
  controller
    .getAllProduct()
    .then((products) => response.success(res, products, 200))
    .catch(next);
});
router.get("/buscar/:termino", (req, res, next) => {
  controller
    .findProduct(req.params.termino)
    .then((product) => response.success(res, product, 200))
    .catch(next);
});
router.get("/:categoria", (req, res, next) => {
  controller
    .findCategoriaProduct(
      req.params.categoria,
      req.query.pagina,
      req.query.orden
    )
    .then((product) => response.success(res, product, 200))
    .catch(next);
});
router.get("/destacados/principales", (req, res, next) => {
  controller
    .findDestacadosPrincipales(req.query.pagina, req.query.orden)
    .then((productos) => response.success(res, productos, 200))
    .catch(next);
});
router.get("/productos/filtrados", (req, res, next) => {
  controller
    .productosFiltrados(req.body)
    .then((product) => response.success(res, product, 200))
    .catch(next);
});
router.get("/informacion/filtro", (req, res, next) => {
  controller
    .informacionFiltro(req.query)
    .then((product) => {
      response.success(res, product, 200);
    })
    .catch(next);
});
router.get("/filtrados/descuento", (erq, res, next) => {
  controller
    .produtosFiltradosPorDescuento()
    .then((productos) => response.success(res, productos, 200))
    .catch(next);
});
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidation(["ALMACEN-ROLE", "ADMIN-ROLE", "USER-ROLE", "GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .addProduct(req.body)
      .then((product) => {
        response.success(res, product, 200);
      })
      .catch(next);
  }
);
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    controller
      .updateProduct(
        req.body.desStock,
        req.body.like,
        req.body.movimiento,
        req.body,
        req.params.id
      )
      .then((product) => {
        response.success(res, product, 200);
      })
      .catch(next);
  }
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidation(["ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    const id = req.params.id;
    controller
      .deleteProduct(id)
      .then((product) => response.success(res, `${product.id} Eliminado`, 200))
      .catch(next);
  }
);
router.patch(
  "/agregar-oferta-producto/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidation(["ADMIN-ROLE", "USER-ROLE", "GERENTE-ROLE", "ALMACEN-ROLE"]),
  (req, res, next) => {
    controller
      .addOfertaProducto(req.params.id, req.body.descuento, req.query.agregar)
      .then((product) => {
        response.success(res, product, 200);
      })
      .catch(next);
  }
);
module.exports = router;
