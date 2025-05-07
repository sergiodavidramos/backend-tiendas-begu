const Direccion = require('./model')

function addDirectionDB(data) {
  const myDirection = new Direccion(data)
  return myDirection.save()
}
function findDirectionDB(id) {
  return Direccion.findById(id)
}
function allDirectionsDB() {
  return Direccion.find()
}
function deleteDirectionDB(id) {
  return Direccion.deleteOne({ _id: id })
}
function updateDirectionDB(direccion, id) {
  return Direccion.findByIdAndUpdate(id, direccion, {
    new: true,
    runValidators: true,
    context: 'query',
  })
}
module.exports = {
  addDirectionDB,
  deleteDirectionDB,
  findDirectionDB,
  allDirectionsDB,
  updateDirectionDB,
}
