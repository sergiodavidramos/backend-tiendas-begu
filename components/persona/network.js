const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
const _ = require("underscore");
require("../../utils/strategies/jwt");
const passport = require("passport");
const scopeValidatorHandler = require("../../utils/middlewares/scopeValidation");

const router = express.Router();
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const id = req.query.id || null;
    const state = req.query.state || null;
    const ci = req.query.ci || null;
    controller
      .getPerson(id, state, ci, req.query.desde, req.query.limite)
      .then((user) => response.success(res, user))
      .catch(next);
  }
);
router.get(
  "/buscar/:termino",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["ADMIN-ROLE", "GERENTE-ROLE"]),
  (req, res, next) => {
    const termino = req.params.termino;
    controller
      .findPersonWithTer(termino)
      .then((user) => {
        response.success(res, user);
      })
      .catch(next);
  }
);
router.post("/", (req, res, next) => {
  controller
    .addPerson(req.body)
    .then((person) => {
      response.success(res, person, 200);
    })
    .catch(next);
});

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const id = req.params.id;
    let body = {};
    body = _.pick(req.body, ["nombre_comp", "ci", "puntos"]);
    controller
      .updatePerson(body, id)
      .then((user) => response.success(res, user))
      .catch(next);
  }
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["ADMIN-ROLE"]),
  (req, res, next) => {
    const id = req.params.id;
    controller
      .deletePerson(id)
      .then((user) => response.success(res, `${user.id} Eliminado`))
      .catch(next);
  }
);

module.exports = router;
