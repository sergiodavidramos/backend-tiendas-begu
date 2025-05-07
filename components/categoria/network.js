const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
const passport = require("passport");
const scopeValidation = require("../../utils/middlewares/scopeValidation");
require("../../utils/strategies/jwt");

const router = express.Router();

router.get("/", (req, res, next) => {
  controller
    .getCategory(req.query.status)
    .then((category) => response.success(res, category))
    .catch(next);
});
router.get("/buscar/:nombre", (req, res, next) => {
  controller
    .getCategoriaPorNombre(req.params.nombre)
    .then((category) => response.success(res, category))
    .catch(next);
});
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidation(["GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .getCategoryId(req.params.id)
      .then((category) => response.success(res, category))
      .catch(next);
  }
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidation(["GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .addCategory(req.body)
      .then((category) => response.success(res, category))
      .catch(next);
  }
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidation(["ADMIN-ROLE", "USER-ROLE", "GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .updateCategory(req.body, req.params.id)
      .then((category) => response.success(res, category))
      .catch(next);
  }
);
module.exports = router;
