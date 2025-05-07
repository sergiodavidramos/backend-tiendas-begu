const {
  addDirectionDB,
  deleteDirectionDB,
  findDirectionDB,
  allDirectionsDB,
  updateDirectionDB,
} = require("./store");
function addDirection({ nombre, direccion, lat, lon, referencia }) {
  if (!direccion || !lat || !lon || !referencia)
    return Promise.reject({ message: "Todos los datos son necesarios" });
  if (nombre)
    return addDirectionDB({
      nombre,
      direccion: direccion.replace(/\b\w/g, (l) => l.toUpperCase()),
      lat,
      lon,
      referencia,
    });
  return addDirectionDB({
    direccion: direccion.replace(/\b\w/g, (l) => l.toUpperCase()),
    lat,
    lon,
    referencia,
  });
}
function findDirectionsById(id) {
  if (!id)
    return Promise.reject({
      message: "El ID de la direccion es necesaria",
    });
  return findDirectionDB(id);
}
function allDirections() {
  return allDirectionsDB();
}
function deleteDirection(id) {
  return deleteDirectionDB(id);
}
function updateDirection(newDirection, id) {
  if (!id)
    return Promise.reject({
      message: "Todos los datos de la dirección son necesarias",
    });
  return updateDirectionDB(newDirection, id);
}
module.exports = {
  addDirection,
  deleteDirection,
  findDirectionsById,
  allDirections,
  updateDirection,
};
