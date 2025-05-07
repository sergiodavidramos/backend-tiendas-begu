const express = require("express");
const router = express.Router();
const response = require("../../../network/response");
const controller = require("./controller");
router.post("/", (req, res, next) => {
  controller
    .login(req, res, next)
    .then(async (user) => {
      const userData = await user.usuario
        .populate("idPersona")
        .populate("direccion")
        .execPopulate();
      const token = user.token;
      response.success(res, { token, usuario: userData }, 200);
    })
    .catch(next);
});
module.exports = router;
