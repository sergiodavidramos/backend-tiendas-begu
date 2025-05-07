const Movimiento = require("./model");

async function addMovimientoDB(datos) {
  const newMovimiento = new Movimiento(datos);
  return newMovimiento.save();
}

async function movimientosPendientesDB(idSucursal) {
  return Movimiento.find({ sucursalDestino: idSucursal, estadoRecibido: false })
    .populate("movimiento.productos", "precioCompra name")
    .populate("sucursalOrigen", "nombre")
    .populate({
      path: "enviaUsuario",
      select: "idPersona",
      populate: {
        path: "idPersona",
        select: "nombre_comp",
      },
    });
}
async function confirmarMovimientoDB(idMovimiento, updateMovimiento) {
  return Movimiento.findByIdAndUpdate(idMovimiento, updateMovimiento);
}
// Reporte para obtener los mivimientos de los productos entre sucursales
async function getMovimientosDB(idSucursal, fechaInicio, fechaFin) {
  return Movimiento.find({
    $or: [
      {
        sucursalOrigen: idSucursal,
      },
      {
        sucursalDestino: idSucursal,
      },
    ],
    $or: [
      {
        fechaEnvio: {
          $gte: new Date(fechaInicio),
          $lte: new Date(fechaFin),
        },
      },
      {
        fechaRecibo: {
          $gte: new Date(fechaInicio),
          $lte: new Date(fechaFin),
        },
      },
    ],
  })
    .populate("sucursalOrigen", "nombre")
    .populate("sucursalDestino", "nombre")
    .populate({
      path: "enviaUsuario",
      select: "idPersona",
      populate: {
        path: "idPersona",
        select: "nombre_comp",
      },
    })
    .populate({
      path: "recibeUsuario",
      select: "idPersona",
      populate: {
        path: "idPersona",
        select: "nombre_comp",
      },
    })
    .populate(
      "movimiento.productos",
      "name precioCompra precioVenta tipoVenta"
    );
}
module.exports = {
  addMovimientoDB,
  movimientosPendientesDB,
  confirmarMovimientoDB,
  getMovimientosDB,
};
