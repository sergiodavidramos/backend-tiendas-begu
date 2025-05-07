const Inventario = require("./model");
ObjectId = require("mongodb").ObjectID;

async function addNewInventarioDB(sucursal, productos = []) {
  const myInventario = new Inventario({
    idSucursal: sucursal,
    allProducts: productos,
  });
  return myInventario.save();
}
// async function addProductoInventarioDB({
//   producto,
//   idLote,
//   stockTotal,
//   idSucursal,
// }) {
//   return Inventario.updateOne(
//     {
//       $and: [
//         { "allProducts.producto": { $ne: producto } },
//         { idSucursal: idSucursal },
//       ],
//     },
//     {
//       $push: {
//         allProducts: {
//           producto: producto,
//           $push: { stockLotes: idLote },
//           stockTotal,
//         },
//       },
//     },
//     { upsert: true }
//   );
// }
async function addProductoInventarioDB({
  producto,
  idLote = false,
  stockTotal,
  idSucursal,
}) {
  let newProducto;
  if (idLote) {
    newProducto = new Inventario({
      producto,
      stockTotal,
      idSucursal,
      stockLotes: [{ lote: idLote }],
    });
  } else {
    newProducto = new Inventario({
      producto,
      stockTotal,
      idSucursal,
    });
  }
  return newProducto.save();
}
async function getProductoInventarioPaginateDB(idSucursal, des) {
  return Promise.all([
    Inventario.find(idSucursal)
      .limit(10)
      .skip((des - 1) * 10)
      .populate("producto", "name status img code")
      .populate("stockLotes.lote"),
    Inventario.aggregate([
      {
        $match: { idSucursal: idSucursal.idSucursal },
      },
      {
        $group: {
          _id: "producto",
          totalProductos: { $sum: 1 },
        },
      },
    ]),
  ]);
}

async function getProductoIdDB(id) {
  return Inventario.find(
    { "allProducts._id": id },
    { "allProducts.$": true }
  ).populate("allProducts.producto");
}

// async function getProductoIdInvetarioIdDB(idProducto, idSucursal) {
//   return Inventario.aggregate([
//     {
//       $unwind: "$allProducts",
//     },
//     {
//       $lookup: {
//         from: "productos",
//         localField: "allProducts.producto",
//         foreignField: "_id",
//         as: "producto",
//       },
//     },
//     {
//       $match: {
//         $and: [{ "producto._id": idProducto }, { idSucursal: idSucursal }],
//       },
//     },
//     {
//       $lookup: {
//         from: "categorias",
//         localField: "producto.category",
//         foreignField: "_id",
//         as: "category",
//       },
//     },
//   ]);
// }
async function getProductoIdInvetarioIdDB(idProducto, idSucursal) {
  return Inventario.find({ producto: idProducto, idSucursal });
}

async function getProductoWithTerminoDB(termino, id) {
  return Inventario.aggregate([
    {
      $unwind: "$producto",
    },
    {
      $lookup: {
        from: "productos",
        localField: "producto",
        foreignField: "_id",
        as: "producto",
      },
    },
    {
      $match: { $and: [{ "producto.name": termino }, { idSucursal: id }] },
    },
    {
      $lookup: {
        from: "lotes",
        localField: "stockLotes.lote",
        foreignField: "_id",
        as: "stockLotes",
      },
    },
  ]);
}
// async function getProductWithCodigoDB(code, id) {
//   return Inventario.aggregate([
//     {
//       $unwind: "$allProducts",
//     },
//     {
//       $lookup: {
//         from: "productos",
//         localField: "allProducts.producto",
//         foreignField: "_id",
//         as: "producto",
//       },
//     },
//     {
//       $match: { $and: [{ "producto.code": code }, { idSucursal: id }] },
//     },
//     {
//       $lookup: {
//         from: "categorias",
//         localField: "producto.category",
//         foreignField: "_id",
//         as: "category",
//       },
//     },
//   ]);
// }
async function getProductWithCodigoDB(code, id) {
  return Inventario.aggregate([
    {
      $unwind: "$producto",
    },
    {
      $lookup: {
        from: "productos",
        localField: "producto",
        foreignField: "_id",
        as: "producto",
      },
    },
    {
      $match: {
        $and: [{ "producto.code": code, idSucursal: id }],
      },
    },
    {
      $lookup: {
        from: "categorias",
        localField: "producto.category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $lookup: {
        from: "lotes",
        localField: "stockLotes.lote",
        foreignField: "_id",
        as: "stockLotes",
      },
    },
  ]);
}
// async function updateStockProductDB(idProducto, stockpp, idSucursal) {
//   return Inventario.updateOne(
//     { idSucursal: { $eq: idSucursal } },
//     {
//       $inc: {
//         "allProducts.$[pro].stock": stockpp,
//       },
//     },
//     { arrayFilters: [{ "pro.producto": { $eq: idProducto } }] }
//   );
// }

//Actualiza el stock de los productos sin lote
async function updateStockProductDB(idProducto, idSucursal, cambios) {
  return Inventario.updateOne(
    { producto: idProducto, idSucursal: idSucursal },
    cambios
  );
}

// TODO REPORTES
// Reporte para inventario
async function getInventarioDB(idSucursal) {
  return Inventario.find({ idSucursal: idSucursal })
    .populate("producto", "code name precioVenta")
    .populate("stockLotes.lote");
}

// Reporte para obtener productos pronto a vencer
async function getProductosCaducidadDB(idSucursal, dias) {
  return Inventario.aggregate([
    {
      $lookup: {
        from: "productos",
        localField: "producto",
        foreignField: "_id",
        as: "producto",
      },
    },
    {
      $lookup: {
        from: "lotes",
        localField: "stockLotes.lote",
        foreignField: "_id",
        as: "stockLotes",
      },
    },
    {
      $unwind: "$producto",
    },
    {
      $unwind: "$stockLotes",
    },
    {
      $match: {
        $and: [
          {
            idSucursal: idSucursal,
            "stockLotes.fechaVencimiento": { $lt: dias },
          },
        ],
      },
    },
    {
      $project: {
        "producto.detail": 0,
        "producto.fechaCaducidad": 0,
        "producto.proveedor": 0,
      },
    },
  ]);
}

// Reporte de productos con poco stock de una sucursal
function getProductosPocaCantidadDB(idSucursal, cantidad) {
  return Inventario.aggregate([
    {
      $lookup: {
        from: "productos",
        localField: "producto",
        foreignField: "_id",
        as: "producto",
      },
    },
    {
      $lookup: {
        from: "lotes",
        localField: "stockLotes.lote",
        foreignField: "_id",
        as: "stockLotes",
      },
    },
    {
      $unwind: "$producto",
    },
    {
      $match: {
        $and: [
          {
            idSucursal: idSucursal,
            stockTotal: { $lt: cantidad },
          },
        ],
      },
    },
    {
      $project: {
        "producto.detail": 0,
        "producto.fechaCaducidad": 0,
        "producto.proveedor": 0,
      },
    },
  ]);
}
module.exports = {
  getProductoInventarioPaginateDB,
  getProductoIdDB,
  addProductoInventarioDB,
  updateStockProductDB,
  addNewInventarioDB,
  getProductoWithTerminoDB,
  getProductWithCodigoDB,
  getProductoIdInvetarioIdDB,
  getInventarioDB,
  getProductosCaducidadDB,
  getProductosPocaCantidadDB,
};
