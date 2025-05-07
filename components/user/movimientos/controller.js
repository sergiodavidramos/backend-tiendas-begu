const { addMovimientoDB, getMovimientoUserDB } = require('./store')

function addMovimiento(user, body) {
  if (!body.monto || !body.fecha || !body.venta) {
    return Promise.reject({ message: 'Todos los datos son necesarios' })
  }
  const monto = parseFloat(body.monto)
  const razon = body.venta === 'true'
  if (razon) {
    if (user.cuenta < monto)
      return Promise.reject({
        message: 'No tiene saldo suficiente para completar la compra',
      })
    else {
      const totalCuenta = user.cuenta - monto
      return addMovimientoDB(totalCuenta, {
        idUser: user._id,
        fecha: new Date(),
        monto: monto * -1,
      })
    }
  } else {
    const totalCuenta = user.cuenta + monto
    return addMovimientoDB(totalCuenta, {
      idUser: user._id,
      fecha: new Date(),
      monto: monto,
    })
  }
}
function getMovimientoUser(idUser) {
  if (!idUser) return Promise.reject({ message: 'El id es necesario' })
  return getMovimientoUserDB(idUser)
}
module.exports = {
  addMovimiento,
  getMovimientoUser,
}
