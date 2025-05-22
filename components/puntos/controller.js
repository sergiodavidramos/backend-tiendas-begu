const { addPuntosDB, updatePuntosDB, getValorPuntosDB } = require("./store");

function getValorPuntos() {
  return getValorPuntosDB();
}
function addPuntos(data) {
  if (!data.valor)
    return Promise.reject({
      status: 400,
      message: "El valor de los puntos es necesario",
    });
  return addPuntosDB(data);
}
function updatePuntos(id, data) {
  if (!data.valor)
    return Promise.reject({
      status: 400,
      message: "El valor de los puntos es necesario",
    });
  return updatePuntosDB(id, data);
}
module.exports = {
  getValorPuntos,
  addPuntos,
  updatePuntos,
};
