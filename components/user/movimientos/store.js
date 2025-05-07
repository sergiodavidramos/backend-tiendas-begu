const Movimiento = require('./model')
const User = require('../model')
function addMovimientoDB(totalCuenta, movi) {
  return User.findByIdAndUpdate(movi.idUser, { cuenta: totalCuenta })
    .then(() => {
      const newMovimiento = new Movimiento(movi)
      return newMovimiento.save()
    })
    .catch((err) => {
      console.log(totalCuenta, 'sd')
      return Promise.reject(err)
    })
}
function getMovimientoUserDB(idUser) {
  return Movimiento.find({ idUser }).sort({$natural:-1}).limit(5)
}
module.exports = {
  addMovimientoDB,
  getMovimientoUserDB,
}
