const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')
const passport = require('passport')
const scopeValidationHandler = require('../../utils/middlewares/scopeValidation')

const router = express.Router()

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  scopeValidationHandler(['GERENTE-ROLE']),
  (req, res, next) => {
    controller
      .addMarca(req.body)
      .then((marca) => {
        response.success(res, marca, 200)
      })
      .catch(next)
  }
)

router.get('/', (req, res, next) => {
  controller
    .getAllMarcas(req.query.state)
    .then((marca) => {
      response.success(res, marca, 200)
    })
    .catch(next)
})
router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  scopeValidationHandler(['GERENTE-ROLE']),
  (req, res, next) => {
    controller
      .updateMarca(req.params.id, req.body)
      .then((marca) => response.success(res, marca))
      .catch(next)
  }
)

module.exports = router
