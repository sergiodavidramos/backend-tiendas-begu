const { addLoteDB, buscarLoteNumeroDB, actualizarStockDB } = require("./store");

function addLote({ numeroLote, stock, fechaVencimiento }) {
  if (!numeroLote || !stock || !fechaVencimiento)
    return Promise.reject({
      message: "Todos los datos son necesarios para registrar el lote",
    });
  return addLoteDB({
    numeroLote,
    stock,
    fechaVencimiento: new Date(fechaVencimiento),
  });
}
function buscarLoteNumero(numeroLote) {
  if (!numeroLote)
    return Promise.reject({ message: "El numero del lote es necesario" });
  return buscarLoteNumeroDB(numeroLote);
}
function actualizarStock(id, stock) {
  if (!id) {
    return Promise.reject({
      message: "Todos los datos son resqueridos para actualizar el stock",
    });
  }
  if (!stock) {
    return Promise.reject({
      message: "Todos los datos son resqueridos para actualizar el stock",
    });
  }
  return actualizarStockDB(id, stock);
}
module.exports = {
  addLote,
  buscarLoteNumero,
  actualizarStock,
};
