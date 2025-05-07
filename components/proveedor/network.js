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
  scopeValidatorHandler(["ADMIN-ROLE", "GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .addProveedor(req.body)
      .then((pro) => response.success(res, pro))
      .catch(next);
  }
);

router.get("/all", (req, res, next) => {
  controller
    .getAllProveedor(req.query.status)
    .then((data) => response.success(res, data))
    .catch(next);
});
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["ADMIN-ROLE", "GERENTE-ROLE"]),
  (req, res, next) => {
    const id = req.params.id || false;
    controller
      .findProveedorId(id)
      .then((data) => response.success(res, data))
      .catch(next);
  }
);

router.get(
  "/buscar/termino",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["ADMIN-ROLE", "GERENTE-ROLE"]),
  (req, res, next) => {
    const termino = req.query.termino || "";
    controller
      .findProveedorTermino(termino)
      .then((data) => response.success(res, data))
      .catch(next);
  }
);
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["ADMIN-ROLE", "GERENTE-ROLE"]),
  (req, res, next) => {
    const id = req.params.id;
    controller
      .updateProveedor(req.body, id)
      .then((datos) => response.success(res, datos))
      .catch(next);
  }
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["ADMIN-ROLE", "GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .deleteProveedor(req.params.id)
      .then((pro) => response.success(res, "Proveedor eliminado"))
      .catch(next);
  }
);
module.exports = router;
