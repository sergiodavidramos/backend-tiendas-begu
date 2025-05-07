const Detalle = require("./model");

function addDetalleDB(detalle) {
  const newDetalle = new Detalle(detalle);
  return new Promise((resolve, reject) => {
    newDetalle
      .save()
      .then((det) =>
        resolve(
          det
            .populate("detalle.producto", "name precioVenta descuento")
            .execPopulate()
        )
      )
      .catch((err) => reject(err));
  });
}
function getDetalleDB(id) {
  return Detalle.findById(id).populate(
    "detalle.producto",
    "name precioVenta descuento"
  );
}

// Reporte para obtener los productos mas vendidos de una sucursal con el margen de ganancia
function getProductosVendidosDB(idSucursal, fechaInicio, fechaFin) {
  return Detalle.aggregate([
    {
      $unwind: "$detalle",
    },
    {
      $match: {
        "detalle.idSucursal": {
          $eq: idSucursal,
        },
        fecha: {
          $gte: new Date(fechaInicio),
          $lte: new Date(fechaFin),
        },

        venta: { $eq: true },
      },
    },
    {
      $group: {
        _id: "$detalle.producto",
        cantidad: { $sum: "$detalle.cantidad" },
        total: { $sum: "$detalle.subTotal" },
      },
    },
    {
      $lookup: {
        from: "productos",
        localField: "_id",
        foreignField: "_id",
        as: "_id",
      },
    },
    {
      $unwind: "$_id",
    },
    {
      $project: {
        "_id.detail": 0,
        "_id.fechaCaducidad": 0,
        "_id.category": 0,
        "_id.proveedor": 0,
        "_id.img": 0,
      },
    },
    {
      $sort: { cantidad: -1 },
    },
  ]);
}

// reportes de ventas y pedidos del dia y el total
function getVentasDiaDB(idSucursal, fechaHoyInicio, fechaHoyFin) {
  return Detalle.aggregate([
    {
      $unwind: "$detalle",
    },
    {
      $match: {
        "detalle.idSucursal": {
          $eq: idSucursal,
        },
        fecha: {
          $gte: new Date(fechaHoyInicio),
          $lte: new Date(fechaHoyFin),
        },
        venta: { $eq: true },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%dT%H", date: "$fecha" } },
        total: { $sum: "$detalle.subTotal" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
}

// reportes de la cantidad de ventas y pedidos del mes y el total
function getVentasMesDB(idSucursal, fechaIni, fechaFin) {
  return Detalle.aggregate([
    {
      $unwind: "$detalle",
    },
    {
      $match: {
        "detalle.idSucursal": {
          $eq: idSucursal,
        },
        fecha: {
          $gte: new Date(fechaIni),
          $lte: new Date(fechaFin),
        },
        venta: { $eq: true },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$fecha" } },
        total: { $sum: "$detalle.subTotal" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
}

// reportes de la cantidad de ventas y pedidos de cada sucursal
function getVentasSucursalesDB() {
  return Detalle.aggregate([
    {
      $unwind: "$detalle",
    },
    {
      $match: {
        venta: { $eq: true },
      },
    },
    {
      $lookup: {
        from: "sucursales",
        localField: "detalle.idSucursal",
        foreignField: "_id",
        as: "detalle.idSucursal",
      },
    },
    {
      $group: {
        _id: "$detalle.idSucursal.nombre",
        total: { $sum: "$detalle.subTotal" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $unwind: "$_id",
    },
  ]);
}

// Reporte para obtener todos los ingresos de una sucursal con rango de fechas
function getIngresosDB(idSucursal, fechaInicio, fechaFin) {
  return Detalle.aggregate([
    {
      $unwind: "$detalle",
    },
    {
      $match: {
        "detalle.idSucursal": {
          $eq: idSucursal,
        },
        fecha: {
          $gte: new Date(fechaInicio),
          $lte: new Date(fechaFin),
        },

        venta: { $eq: true },
      },
    },
    {
      $lookup: {
        from: "productos",
        localField: "detalle.producto",
        foreignField: "_id",
        as: "detalle.producto",
      },
    },
    {
      $unwind: "$detalle.producto",
    },
    {
      $project: {
        "detalle.producto.detail": 0,
        "detalle.producto.fechaCaducidad": 0,
        "detalle.producto.category": 0,
        "detalle.producto.proveedor": 0,
        "detalle.producto.img": 0,
      },
    },
  ]);
}

module.exports = {
  addDetalleDB,
  getDetalleDB,
  getProductosVendidosDB,
  getVentasDiaDB,
  getVentasMesDB,
  getVentasSucursalesDB,
  getIngresosDB,
};
