const {
  addCompraDB,
  getCompraIdDB,
  addEgresoDB,
  getReporteEgresosDB,
} = require("./store");
const fetch = require("node-fetch");
require("dotenv").config();

async function addCompra(body, user, userToken) {
  if (!body.detalleCompra || !body.sucursal)
    return Promise.reject({ message: "Todos los campos son obligatorios" });
  try {
    const det = await fetch(`${process.env.API_URL}/detalle`, {
      method: "POST",
      body: JSON.stringify({ detalle: body.detalleCompra, venta: false }),
      headers: {
        "Content-Type": "application/json",
        Authorization: userToken,
      },
    });
    let total = 0;
    const detalle = await det.json();
    if (detalle.error)
      return Promise.reject({ message: "Error al registrar el detalle" });
    for (let producto of detalle.body.detalle) {
      total += parseFloat(producto.subTotal);
    }
    const efectivo = parseFloat(body.efectivo);

    return new Promise(async (resolve, reject) => {
      const compra = {
        idSucursal: body.sucursal,
        user: user._id,
        detalleCompra: detalle.body._id,
        fecha: new Date(),
        total,
        proveedor: body.proveedor,
        efectivo: body.efectivo,
        cambio: Number.isFinite(efectivo) ? (efectivo - total).toFixed(2) : 0,
      };
      if (body.numeroFacturaCompra)
        compra.numeroFacturaCompra = body.numeroFacturaCompra;
      addCompraDB(compra).then((datos) => {
        try {
          for (const dat of body.infoProductos) {
            Promise.all([
              fetch(`${process.env.API_URL}/productos/${dat._id}`, {
                method: "PATCH",
                body: JSON.stringify({ desStock: dat.cantidad }),
                headers: {
                  Authorization: userToken,
                  "Content-Type": "application/json",
                },
              }),
              fetch(`${process.env.API_URL}/productos/${dat._id}`, {
                method: "PATCH",
                body: JSON.stringify({
                  precioCompra: dat.precioCompra,
                  precioVenta: dat.precioVenta,
                }),
                headers: {
                  Authorization: userToken,
                  "Content-Type": "application/json",
                },
              }),
              fetch(`${process.env.API_URL}/inventario/nuevo/producto`, {
                method: "POST",
                body: JSON.stringify({
                  idProducto: dat._id,
                  stock: dat.cantidad,
                  idSucursal: body.sucursal,
                  numeroLote: dat.lote ? dat.numeroLote : false,
                  fechaVencimientoLote: dat.lote
                    ? dat.fechaVencimientoLote
                    : false,
                }),
                headers: {
                  Authorization: userToken,
                  "Content-Type": "application/json",
                },
              }),
            ])
              .then(([r1, r2, r3]) => {
                return r3.json();
              })
              .then((dato) => {
                // console.log(dato);
              })
              .catch((error) => console.log("Error-->", error));
          }
        } catch (err) {
          console.log(err);
          return reject({ message: "Error al registrar la compra " });
        }
        return resolve(datos);
      });
    });
  } catch (err) {
    console.log("ERROR", err);
    return Promise.reject({ message: err.error });
  }
}

// registra un egreso
async function addEgreso(body, user) {
  if (!body.detalleTexto || !body.idSucursal || !body.total)
    return Promise.reject({ message: "Todos los campos son obligatorios" });
  try {
    const compra = {
      idSucursal: body.idSucursal,
      user: user._id,
      detalleTexto: body.detalleTexto,
      fecha: new Date(),
      total: body.total,
    };
    if (body.numeroFacturaCompra)
      compra.numeroFacturaCompra = body.numeroFacturaCompra;
    return addEgresoDB(compra);
  } catch (err) {
    console.log("ERROR", err);
    return Promise.reject({ message: err.error });
  }
}
async function getCompraId(id) {
  if (!id)
    return Promise.reject({ message: "El Id de la compra es necesario" });
  return getCompraIdDB(id);
}

// Reporte para obtener todos los egresos de una sucursal
function getReporteEgresos(idSucursal, fechaInicio, fechaFin) {
  if (!idSucursal || !fechaInicio || !fechaFin)
    return Promise.reject({ message: "Todos los datos son necesarios" });
  let idSu = ObjectId(idSucursal);
  return getReporteEgresosDB(idSu, fechaInicio, fechaFin);
}

module.exports = {
  addCompra,
  getCompraId,
  addEgreso,
  getReporteEgresos,
};
