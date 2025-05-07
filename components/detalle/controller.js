const {
  addDetalleDB,
  getDetalleDB,
  getProductosVendidosDB,
  getVentasDiaDB,
  getVentasMesDB,
  getVentasSucursalesDB,
  getIngresosDB,
} = require("./store");
const fetch = require("node-fetch");
require("dotenv").config();
const expectedRound = require("expected-round");
ObjectId = require("mongodb").ObjectID;
const moment = require("moment");
function addDetalle(detalle, venta = true) {
  let mandarDatosDB = [];
  if (!detalle || detalle.length === 0)
    return Promise.reject({ message: "Los datos son obligatorios" });
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < detalle.length; i++) {
      try {
        const producto = await fetch(
          `${process.env.API_URL}/productos?id=${detalle[i].producto}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const datos = await producto.json();
        if (datos.error || datos.body[0].length <= 0) {
          throw new SyntaxError(
            "Error en el detalle Producto: no encontrado con esa ID "
          );
        }
        const productoDB = datos.body[0][0];
        if (productoDB.descuento > 0 && venta === true) {
          const precioConDescuento =
            productoDB.precioVenta -
            (productoDB.descuento * productoDB.precioVenta) / 100;

          // expectedRound.round10(precioConDescuento, -1).toFixed(2) **redonde los decimales**

          mandarDatosDB.push({
            producto: detalle[i].producto,
            cantidad: detalle[i].cantidad,
            subTotal: expectedRound
              .round10(detalle[i].cantidad * precioConDescuento, -1)
              .toFixed(2),
            tipoVenta: detalle[i].tipoVenta,
            precioVenta: detalle[i].precioVenta,
            descuento: detalle[i].descuento,
            idSucursal: detalle[i].idSucursal,
          });
        } else {
          if (venta === false) {
            mandarDatosDB.push({
              producto: detalle[i].producto,
              cantidad: detalle[i].cantidad,
              subTotal: (detalle[i].cantidad * productoDB.precioCompra).toFixed(
                2
              ),
              idSucursal: detalle[i].idSucursal,
            });
          } else
            mandarDatosDB.push({
              producto: detalle[i].producto,
              cantidad: detalle[i].cantidad,
              subTotal: (detalle[i].cantidad * productoDB.precioVenta).toFixed(
                2
              ),
              tipoVenta: detalle[i].tipoVenta,
              precioVenta: detalle[i].precioVenta,
              descuento: detalle[i].descuento,
              idSucursal: detalle[i].idSucursal,
            });
        }
      } catch (error) {
        console.log(error);
        reject({
          message: "Error al obtener el producto del servidor",
        });
      }
    }
    if (mandarDatosDB.length > 0)
      addDetalleDB({ detalle: mandarDatosDB, venta, fecha: new Date() })
        .then((det) => {
          resolve(det);
        })
        .catch((error) => {
          console.log(error);
          reject({ message: "Error al registrar el detalle" });
        });
  });
}

function getDetalle(id) {
  return getDetalleDB(id);
}

// Reportes
// Reporte para obtener los productos mas vendidos de una sucursal con el margen de ganancia
function getProductosVendidos(idSucursal, fechaInicio, fechaFin) {
  if (!idSucursal || !fechaInicio || !fechaFin)
    return Promise.reject({ message: "Todos los datos son necesarios" });
  let idSu = ObjectId(idSucursal);
  return getProductosVendidosDB(idSu, fechaInicio, fechaFin);
}

// reportes de ventas y pedidos del dia y el total
function getVentasDia(idSucursal) {
  let idSu;
  if (!idSucursal)
    return Promise.reject({ message: "Todos los datos son necesarios" });
  idSu = ObjectId(idSucursal);
  const fechaHoyInicio = moment().format("yyyy-MM-DD");
  const fechaHoyFin = moment().format();
  return getVentasDiaDB(idSu, fechaHoyInicio, fechaHoyFin);
}

// reportes de la cantidad de ventas y pedidos del mes y el total
function getVentasMes(idSucursal, añoAnterior = "no") {
  let idSu;
  if (!idSucursal)
    return Promise.reject({ message: "Todos los datos son necesarios" });
  idSu = ObjectId(idSucursal);
  if (añoAnterior === "no") {
    const fechaHoyInicio = moment().format(`${moment().year()}-01-1`);
    const fechaHoyFin = moment().format();
    return getVentasMesDB(idSu, fechaHoyInicio, fechaHoyFin);
  } else {
    const fechaHoyInicio = moment().format(`${moment().year() - 1}-01-1`);
    const fechaHoyFin = moment().format();
    return getVentasMesDB(idSu, fechaHoyInicio, fechaHoyFin);
  }
}

// reportes de la cantidad de ventas y pedidos de cada sucursal
function getVentasSucursales() {
  return getVentasSucursalesDB();
}

// Reporte para obtener todos los ingresos de una sucursal con rango de fechas
function getIngresos(idSucursal, fechaInicio, fechaFin) {
  if (!idSucursal || !fechaInicio || !fechaFin)
    return Promise.reject({ message: "Todos los datos son necesarios" });
  let idSu = ObjectId(idSucursal);
  return getIngresosDB(idSu, fechaInicio, fechaFin);
}
module.exports = {
  addDetalle,
  getDetalle,
  getProductosVendidos,
  getVentasDia,
  getVentasMes,
  getVentasSucursales,
  getIngresos,
};
