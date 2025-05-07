const Marca = require('./model')

function addMarcaDB(newMarca) {
  const marca = new Marca(newMarca)
  return marca.save()
}
function getAllMarcasDB(c) {
  return Marca.find(c)
}
function updateMarcaDB(id, marca) {
  return Marca.findByIdAndUpdate(id, marca, { new: true })
}
module.exports = {
  getAllMarcasDB,
  addMarcaDB,
  updateMarcaDB,
}
