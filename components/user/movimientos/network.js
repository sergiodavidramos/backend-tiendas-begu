const express = require('express')
const controller = require('./controller')
const response = require('../../../network/response')
require('../../../utils/strategies/jwt')
const passport = require('passport')
const router = express.Router()

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    controller
      .addMovimiento(req.user, req.body)
      .then((movi) => response.success(res, movi, 200))
      .catch(next)
  }
)
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    controller
      .getMovimientoUser(req.user)
      .then((movi) => response.success(res, movi, 200))
      .catch(next)
  }
)
module.exports = router
