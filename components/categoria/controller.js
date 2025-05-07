const {
  addCategoryDB,
  getCategoryDB,
  getCategoryIdDB,
  updateCategoryDB,
  getCategoriaPorNombreDB,
} = require("./store");

function getCategory(status = "0") {
  if (status === "0") return getCategoryDB({});
  return getCategoryDB({ status: status });
}
function getCategoriaPorNombre(nombre) {
  const termino = new RegExp(nombre, "i");
  return getCategoriaPorNombreDB(termino);
}
function getCategoryId(id) {
  return getCategoryIdDB(id);
}
function addCategory(body) {
  if (!body.name)
    return Promise.reject({
      message: "El Nombre de la categoria es necesaria",
    });

  const name = body.name.replace(/\b\w/g, (l) => l.toUpperCase());
  return addCategoryDB(name, body.description);
}
function updateCategory(newCategory, id) {
  if (Object.keys(newCategory).length === 0 && !id)
    return Promise.reject({
      message: "Los datos son requeridos para ser Actualizados",
    });
  return updateCategoryDB(newCategory, id);
}
module.exports = {
  getCategory,
  addCategory,
  getCategoryId,
  updateCategory,
  getCategoriaPorNombre,
};
