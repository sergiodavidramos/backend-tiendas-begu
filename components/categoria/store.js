const Category = require("./model");

function getCategoryDB(status) {
  return Category.find(status);
}
function getCategoriaPorNombreDB(ter) {
  return Category.find({ name: ter });
}
function getCategoryIdDB(id) {
  return Category.findById({ _id: id });
}
function addCategoryDB(name, description) {
  const newCategory = new Category({ name, description });
  return newCategory.save();
}
function updateCategoryDB(newCategory, id) {
  return Category.findByIdAndUpdate(id, newCategory, {
    new: true,
    runValidators: true,
    context: "query",
  });
}
module.exports = {
  getCategoryDB,
  addCategoryDB,
  getCategoryIdDB,
  updateCategoryDB,
  getCategoriaPorNombreDB,
};
