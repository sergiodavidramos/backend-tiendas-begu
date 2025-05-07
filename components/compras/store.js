const Compra = require("./model");

function addCompraDB(compra) {
  const newCompra = new Compra(compra);
  return newCompra.save();
}
// registra un egreso
function addEgresoDB(compra) {
  const egreso = new Compra(compra);
  return egreso.save();
}
function getCompraIdDB(id) {
  return Compra.findById(id)
    .populate({
      path: "detalleCompra",
      populate: {
        path: "detalle.producto",
        select: "name tipoVenta precioVenta descuento",
      },
    })
    .populate("proveedor", "nombreComercial")
    .populate("idSucursal", "nombre")
    .populate({
      path: "user",
      select: "idPersona",
      populate: {
        path: "idPersona",
        select: "nombre_comp",
      },
    });
}
function getCompraFechaDB(start, end) {
  return;
}

// Reporte para obtener todos los egresos de una sucursal
function getReporteEgresosDB(idSucursal, fechaInicio, fechaFin) {
  return Compra.aggregate([
    {
      $match: {
        idSucursal: {
          $eq: idSucursal,
        },
        fecha: {
          $gte: new Date(fechaInicio),
          $lte: new Date(fechaFin),
        },
      },
    },
    {
      $lookup: {
        from: "detallecompraventas",
        localField: "detalleCompra",
        foreignField: "_id",
        as: "detalleCompra",
      },
    },

    {
      $lookup: {
        from: "productos",
        localField: "detalleCompra.detalle.producto",
        foreignField: "_id",
        as: "productos",
      },
    },

    {
      $lookup: {
        from: "usuarios",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $project: {
        "productos.detail": 0,
        "productos.fechaCaducidad": 0,
        "productos.category": 0,
        "productos.proveedor": 0,
        "productos.img": 0,
        "productos.like": 0,
        "productos.cantidadVendidos": 0,
        "user.direccion": 0,
        "user.favoritos": 0,
        "user.cuenta": 0,
        "user.facebook": 0,
        "user.google": 0,
        "user.personal": 0,
        "user.img": 0,
      },
    },
  ]);
}
module.exports = {
  addCompraDB,
  addEgresoDB,
  getCompraIdDB,
  getCompraFechaDB,
  getReporteEgresosDB,
};
