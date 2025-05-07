const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
const router = express.Router();
require("../../utils/strategies/jwt");
const passport = require("passport");
const scopeValidationHandler = require("../../utils/middlewares/scopeValidation");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler(["GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .addSucursal(req.body, req.headers.authorization)
      .then((sucursal) => response.success(res, sucursal))
      .catch(next);
  }
);

router.get("/all", (req, res, next) => {
  controller
    .getSucursales()
    .then((sucursales) => response.success(res, sucursales))
    .catch(next);
});
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler([
    "GERENTE-ROLE",
    "ADMIN-ROLE",
    "USER-ROLE",
    "DELIVERY-ROLE",
  ]),
  (req, res, next) => {
    controller
      .getSucursalId(req.params.id)
      .then((sucursal) => response.success(res, sucursal))
      .catch(next);
  }
);
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler(["GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .updateSucursal(req.params.id, req.body, req.headers.authorization)
      .then(async (sucursal) => {
        response.success(res, {
          sucursalNuevo: await sucursal[0]
            .populate({
              path: "administrador",
              populate: { path: "idPersona" },
            })
            .execPopulate(),
          direccion: sucursal[1].body,
        });
      })
      .catch(next);
  }
);
module.exports = router;
