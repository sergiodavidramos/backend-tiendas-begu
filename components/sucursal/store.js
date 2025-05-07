const Sucursal = require("./model");

function addSucursalDB(newSucursal) {
  const sucursal = new Sucursal(newSucursal);
  return sucursal.save();
}
function getSucursalesDB() {
  return Sucursal.find()
    .populate("direccion")
    .populate({
      path: "administrador",
      populate: { path: "idPersona" },
    });
}
function getSucursalIdDB(id) {
  return Sucursal.findById(id)
    .populate("direccion")
    .populate({
      path: "administrador",
      populate: { path: "idPersona" },
    })
    .populate({
      path: "administrador",
      populate: { path: "direccion" },
    });
}
function updateSucursalDB(newSucursal, id) {
  return Sucursal.findOneAndUpdate({ _id: id }, newSucursal, {
    new: true,
    runValidators: true,
    context: "query",
  });
}

module.exports = {
  addSucursalDB,
  getSucursalesDB,
  updateSucursalDB,
  getSucursalIdDB,
};
