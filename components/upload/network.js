const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
const passport = require("passport");
require("../../utils/strategies/jwt");
const router = express.Router();
const fileUpload = require("express-fileupload");
router.use(fileUpload());

router.put(
  "/:tipo/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    controller
      .subirFoto(req)
      .then((data) => response.success(res, data))
      .catch(next);
  }
);
router.get("/:tipo/:foto", (req, res) => {
  controller.retornaImagen(req, res);
});

module.exports = router;
