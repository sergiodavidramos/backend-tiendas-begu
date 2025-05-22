const Puntos = require("./model");

function getValorPuntosDB() {
  return Puntos.find();
}

function addPuntosDB(data) {
  const puntos = new Puntos(data);
  return puntos.save();
}
function updatePuntosDB(id, data) {
  return Puntos.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
    context: "query",
  });
}

module.exports = {
  getValorPuntosDB,
  addPuntosDB,
  updatePuntosDB,
};
