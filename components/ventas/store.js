const Venta = require("./model");

function getVentaIdDB(id) {
  return Venta.findById(id)
    .populate({
      path: "detalleVenta",
      populate: {
        path: "detalle.producto",
        select: "name tipoVenta precioVenta descuento",
      },
    })
    .populate({
      path: "idSucursal",
      select: "nombre",
      populate: {
        path: "ciudad",
        select: "nombre",
      },
    })
    .populate("client", "nombre_comp")
    .populate({
      path: "user",
      select: "idPersona",
      populate: {
        path: "idPersona",
        select: "nombre_comp",
      },
    });
}
function getVentaFechaDB(start, end) {
  return Venta.find({
    $and: [
      {
        fecha: {
          $gte: new Date(start),
          $lt: new Date(end),
        },
      },
    ],
  })
    .populate({
      path: "detalleVenta",
      populate: {
        path: "detalle.producto",
        select: "name tipoVenta precioVenta",
      },
    })
    .populate({
      path: "idSucursal",
      select: "nombre",
      populate: {
        path: "ciudad",
        select: "nombre",
      },
    })
    .populate("client", "nombre_comp")
    .populate({
      path: "user",
      select: "idPersona",
      populate: {
        path: "idPersona",
        select: "nombre_comp",
      },
    });
}
function addVentaDB(venta) {
  const newVenta = new Venta(venta);
  return newVenta.save();
}
async function actualizarVentaDB(id, newVenta) {
  return Venta.findByIdAndUpdate(id, newVenta, {
    new: true,
    runValidators: true,
  }).populate({
    path: "detalleVenta",
    populate: {
      path: "detalle.producto",
      select: "name tipoVenta precioVenta",
    },
  });
}

// TODO REPORTES
// reporte para obtener cantidad de ventas presenciales los año
function getCantidadVentasDB(idSucursal) {
  return Venta.aggregate([
    {
      $match: {
        idSucursal: {
          $eq: idSucursal,
        },
        state: {
          $eq: true,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y", date: "$fecha" } },
        ventasTotales: { $sum: "$total" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
}
module.exports = {
  addVentaDB,
  getVentaIdDB,
  getVentaFechaDB,
  actualizarVentaDB,
  getCantidadVentasDB,
};
