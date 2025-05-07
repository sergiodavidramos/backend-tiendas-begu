const {
  addVentaDB,
  getVentaIdDB,
  getVentaFechaDB,
  actualizarVentaDB,
  getCantidadVentasDB,
} = require("./store");
var html_to_pdf = require("html-pdf-node");
const fs = require("fs");
const fetch = require("node-fetch");
ObjectId = require("mongodb").ObjectID;
require("dotenv").config();

function getVentaId(id) {
  return getVentaIdDB(id);
}
function getVentaFecha(fechaInicio, fechaFin) {
  if (!fechaInicio || !fechaFin)
    return Promise.reject({ message: "El rango de fecha es obligatorio" });
  return getVentaFechaDB(fechaInicio, fechaFin);
}

async function addVenta(body, user, userToken) {
  const ubicacionPlantilla = require.resolve("./static/factura.html");
  let contenidoHtml = fs.readFileSync(ubicacionPlantilla, "utf8");

  const fechaHoy = new Date();
  let tabla = "";
  let subtotal = 0;
  if (!body.detalleVenta || !body.client)
    return Promise.reject("Los Campos son obligatorios");
  try {
    const det = await fetch(`${process.env.API_URL}/detalle`, {
      method: "POST",
      body: JSON.stringify({ detalle: body.detalleVenta }),
      headers: {
        "Content-Type": "application/json",
        Authorization: userToken,
      },
    });
    let total = 0;
    let descuento = 0;
    let contarPixeles = 0;
    const detalle = await det.json();
    if (detalle.error) return Promise.reject({ message: detalle.body });
    for (let producto of body.detalleVenta) {
      total += parseFloat(producto.subTotal);
      const totalProducto = producto.cantidad * producto.precioVenta;
      subtotal += totalProducto;
      descuento += producto.subTotal - totalProducto;
      contarPixeles += 24;
      tabla += `<tr>
          <td>${producto.cantidad.toFixed(2)}</td>
          <td>${producto.nombreProducto}</td>
          <td>${`${producto.precioVenta.toFixed(2)}${
            producto.descuento > 0
              ? " - Desc.(" + producto.descuento + "%)"
              : ""
          }`}</td>
          <td>${totalProducto.toFixed(2)}</td>
          </tr>`;
    }

    // Remplazar el valor {{tablaProductos}} por el verdadero valor
    contenidoHtml = contenidoHtml.replace("{{tablaProductos}}", tabla);

    contenidoHtml = contenidoHtml.replace("{{subtotal}}", subtotal.toFixed(2));
    contenidoHtml = contenidoHtml.replace(
      "{{descuento}}",
      descuento.toFixed(2)
    );
    contenidoHtml = contenidoHtml.replace(
      "{{subtotalConDescuento}}",
      total.toFixed(2)
    );
    contenidoHtml = contenidoHtml.replace(
      "{{fechaVenta}}",
      `${fechaHoy.getDate()}-${
        fechaHoy.getMonth() + 1
      }-${fechaHoy.getFullYear()}`
    );
    contenidoHtml = contenidoHtml.replace("{{ciCliente}}", body.client.ci);
    contenidoHtml = contenidoHtml.replace(
      "{{nombreCliente}}",
      body.client.nombre
    );
    contenidoHtml = contenidoHtml.replace(
      "{{totalEnLetras}}",
      numeroALetras(total.toFixed(2))
    );
    var nombrecortado = user.idPersona.nombre_comp.split(" ");
    contenidoHtml = contenidoHtml.replace("{{userNombre}}", nombrecortado[0]);
    contenidoHtml = contenidoHtml.replace(
      "{{horaVenta}}",
      `${fechaHoy.getHours()}:${fechaHoy.getMinutes()}:${fechaHoy.getSeconds()}`
    );
    contenidoHtml = contenidoHtml.replace("{{idDetalle}}", detalle.body._id);
    contenidoHtml = contenidoHtml.replace(
      "{{nombreSucursal}}",
      body.sucursal.nombre
    );
    contenidoHtml = contenidoHtml.replace(
      "{{direccionSucursal}}",
      body.sucursal.direccion.direccion
    );
    contenidoHtml = contenidoHtml.replace("{{ciudadSucursal}}", "Potosí");
    contenidoHtml = contenidoHtml.replace(
      "{{efectivo}}",
      body.efectivo === "" ? 0 : parseFloat(body.efectivo).toFixed(2)
    );
    contenidoHtml = contenidoHtml.replace(
      "{{cambioEfectivo}}",
      (parseFloat(body.efectivo) - total).toFixed(2)
    );
    const efectivoCambiado = parseFloat(body.efectivo);
    return new Promise(async (resolve, reject) => {
      const venta = {
        user: user._id,
        idSucursal: user.idSucursal,
        client: body.client.id,
        detalleVenta: detalle.body._id,
        fecha: new Date(),
        total: total.toFixed(2),
        efectivo: body.efectivo,
        cambio: Number.isFinite(efectivoCambiado)
          ? (efectivoCambiado - total).toFixed(2)
          : 0,
      };
      const altura = (((700 + contarPixeles) * 2.54) / 96) * 10;
      addVentaDB(venta)
        .then(async (datos) => {
          try {
            for (const dat of detalle.body.detalle) {
              Promise.all([
                fetch(`${process.env.API_URL}/productos/${dat.producto._id}`, {
                  method: "PATCH",
                  body: JSON.stringify({ desStock: -dat.cantidad }),
                  headers: {
                    Authorization: userToken,
                    "Content-Type": "application/json",
                  },
                }),
                fetch(`${process.env.API_URL}/inventario/actualiza-stock`, {
                  method: "PATCH",
                  body: JSON.stringify({
                    idProducto: dat.producto._id,
                    datos: { stockTotal: dat.cantidad },
                    idSucursal: user.idSucursal,
                    venta: true,
                  }),
                  headers: {
                    Authorization: userToken,
                    "Content-Type": "application/json",
                  },
                }),
              ]);
            }

            // Actualizar puntos del cliente
            fetch(`${process.env.API_URL}/person/${body.client.id}`, {
              method: "PATCH",
              body: JSON.stringify({
                puntos: Math.floor(total / 10),
              }),
              headers: {
                "Content-type": "application/json",
                Authorization: userToken,
              },
            });

            // if (total > 25 && total < 50)
            //   fetch(`${process.env.API_URL}/person/${body.client.id}`, {
            //     method: "PATCH",
            //     body: JSON.stringify({
            //       puntos: 4,
            //     }),
            //     headers: {
            //       "Content-type": "application/json",
            //       Authorization: userToken,
            //     },
            //   });
            // if (total > 50)
            //   fetch(`${process.env.API_URL}/person/${body.client.id}`, {
            //     method: "PATCH",
            //     body: JSON.stringify({
            //       puntos: 6,
            //     }),
            //     headers: {
            //       "Content-type": "application/json",
            //       Authorization: userToken,
            //     },
            //   });
          } catch (err) {
            console.log("Error-->", err);
            return reject({ message: err.message });
          }
          var options = {
            paginationOffset: 1,
            width: "80mm",
            height: `${altura}mm`,
            zoomFactor: "94",
          };

          let file = { content: contenidoHtml };
          html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
            return resolve(pdfBuffer);
          });
        })
        .catch((err) => {
          console.log("ERROR", err);
        });
    });
  } catch (err) {
    console.log("ERORRR", err);
    return Promise.reject({ message: err });
  }
}

var numeroALetras = (function () {
  function Unidades(num) {
    switch (num) {
      case 1:
        return "UN";
      case 2:
        return "DOS";
      case 3:
        return "TRES";
      case 4:
        return "CUATRO";
      case 5:
        return "CINCO";
      case 6:
        return "SEIS";
      case 7:
        return "SIETE";
      case 8:
        return "OCHO";
      case 9:
        return "NUEVE";
    }
    return "";
  } //unidades
  function Decenas(num) {
    let decena = Math.floor(num / 10);
    let unidad = num - decena * 10;
    switch (decena) {
      case 1:
        switch (unidad) {
          case 0:
            return "DIEZ";
          case 1:
            return "ONCE";
          case 2:
            return "DOCE";
          case 3:
            return "TRECE";
          case 4:
            return "CATORCE";
          case 5:
            return "QUINCE";
          default:
            return "DIECI" + Unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0:
            return "VEINTE";
          default:
            return "VEINTI" + Unidades(unidad);
        }
      case 3:
        return DecenasY("TREINTA", unidad);
      case 4:
        return DecenasY("CUARENTA", unidad);
      case 5:
        return DecenasY("CINCUENTA", unidad);
      case 6:
        return DecenasY("SESENTA", unidad);
      case 7:
        return DecenasY("SETENTA", unidad);
      case 8:
        return DecenasY("OCHENTA", unidad);
      case 9:
        return DecenasY("NOVENTA", unidad);
      case 0:
        return Unidades(unidad);
    }
  } //DECENAS
  function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0) return strSin + " Y " + Unidades(numUnidades);
    return strSin;
  } // Decenas Y()
  function Centenas(num) {
    let centenas = Math.floor(num / 100);
    let decenas = num - centenas * 100;
    switch (centenas) {
      case 1:
        if (decenas > 0) return "CIENTO" + Decenas(decenas);
        return "CIEN";
      case 2:
        return "DOCIENTOS " + Decenas(decenas);
      case 3:
        return "TRECIENTOS " + Decenas(decenas);
      case 4:
        return "CUATROCIENTOS " + Decenas(decenas);
      case 5:
        return "QUINIENTOS " + Decenas(decenas);
      case 6:
        return "SEISCIENTOS " + Decenas(decenas);
      case 7:
        return "SETECIENTOS " + Decenas(decenas);
      case 8:
        return "OCHOCIENTOS " + Decenas(decenas);
      case 9:
        return "NOVECIENTOS " + Decenas(decenas);
    }
    return Decenas(decenas);
  } // Centenas()
  function Seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;
    let letras = "";
    if (cientos > 0)
      if (cientos > 1) letras = Centenas(cientos) + " " + strPlural;
      else letras = strSingular;
    if (resto > 0) letras += "";
    return letras;
  } //Seccion()

  function Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let strMiles = Seccion(num, divisor, "UN MIL", "MIL");
    let strCentenas = Centenas(resto);

    if (strMiles == "") return strCentenas;
    return strMiles + " " + strCentenas;
  } //Miles()

  function Millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let strMillones = Seccion(num, divisor, "UN MILLON DE", "MILLONES");
    let strMiles = Miles(resto);

    if (strMillones == "") return strMiles;
    return strMillones + " " + strMiles;
  } //Millones()
  return function NumeroALetras(num, currency) {
    currency = currency || {};
    let data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: Math.round(num * 100) - Math.floor(num) * 100,
      letrasCentavos: "",
      letrasMonedaPlural: currency.plural || "BOLIVIANOS",
      letrasMonedaSingular: currency.singular || "BOLIVIANO",
      letrasMonedaCentavoPlural: currency.centPlural || "CENTAVOS",
      letrasMonedaCentavoSingular: currency.centSingular || "CENTAVO",
    };
    if (data.centavos > 0) {
      data.letrasCentavos =
        "CON " +
        (function () {
          if (data.centavos == 1)
            return (
              Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular
            );
          else
            return (
              Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural
            );
        })();
    }
    if (data.enteros == 0)
      return "CERO" + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1)
      return (
        Millones(data.enteros) +
        " " +
        data.letrasMonedaSingular +
        " " +
        data.letrasCentavos
      );
    else
      return (
        Millones(data.enteros) +
        " " +
        data.letrasMonedaPlural +
        " " +
        data.letrasCentavos
      );
  };
})();

async function actualizarVenta(id, newVenta, token) {
  if (Object.keys(newVenta).length === 0 && !id)
    return Promise.reject({
      message: "Todos los datos son requeridos para actualizar la venta",
    });

  return new Promise(async (resolve, reject) => {
    try {
      const ventaActualizada = await actualizarVentaDB(id, newVenta);
      if (ventaActualizada.state === false) {
        for (const dat of ventaActualizada.detalleVenta.detalle) {
          Promise.all([
            fetch(`${process.env.API_URL}/productos/${dat.producto._id}`, {
              method: "PATCH",
              body: JSON.stringify({ desStock: dat.cantidad }),
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }),
            fetch(`${process.env.API_URL}/inventario/actualiza-stock`, {
              method: "PATCH",
              body: JSON.stringify({
                idProducto: dat.producto._id,
                stock: dat.cantidad,
                idSucursal: ventaActualizada.idSucursal,
              }),
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }),
          ]);
        }
      }
      return resolve(ventaActualizada);
    } catch (error) {
      return reject(error);
    }
  });
}

// TODO Reportes
// reporte para obtener cantidad de ventas presenciales los año
function getCantidadVentas(idSucursal) {
  let idSu = idSucursal;
  if (!idSu)
    return Promise.reject({ message: "El id de la sucursal es necesario" });
  else idSu = ObjectId(idSucursal);
  return getCantidadVentasDB(idSu);
}
module.exports = {
  addVenta,
  getVentaId,
  getVentaFecha,
  actualizarVenta,
  getCantidadVentas,
};
