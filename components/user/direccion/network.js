const express = require("express");
const controller = require("./controller");
require("../../../utils/strategies/jwt");
const passport = require("passport");
const response = require("../../../network/response");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    controller
      .addDirection(req.body)
      .then((dir) => response.success(res, dir, 200))
      .catch(next);
  }
);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    controller
      .findDirectionsById(req.query.id)
      .then((directions) => response.success(res, directions))
      .catch(next);
  }
);
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    controller
      .allDirections()
      .then((directions) => response.success(res, directions))
      .catch(next);
  }
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    controller
      .updateDirection(req.body, req.params.id)
      .then((direction) => response.success(res, direction))
      .catch(next);
  }
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    controller
      .deleteDirection(req.params.id)
      .then((deleted) =>
        response.success(
          res,
          `${deleted.deletedCount} Direccion eliminado`,
          200
        )
      )
      .catch(next);
  }
);

module.exports = router;
