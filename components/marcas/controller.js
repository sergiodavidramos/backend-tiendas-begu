const { addMarcaDB, getAllMarcasDB, updateMarcaDB } = require('./store')

function addMarca(body) {
  return addMarcaDB({
    nombre: body.nombre.replace(/\b\w/g, (l) => l.toUpperCase()),
  })
}
function getAllMarcas(state = {}) {
  return getAllMarcasDB(state)
}
function updateMarca(id, newMarca) {
  return updateMarcaDB(id, newMarca)
}

module.exports = {
  addMarca,
  getAllMarcas,
  updateMarca,
}
