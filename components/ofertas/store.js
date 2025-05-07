const Ofertas = require("./model");
async function getOfferStateDB(state) {
  return Ofertas.find(state);
}
async function getOfferIdDB(id) {
  return Ofertas.findOne({ _id: id }).populate("productos");
}
async function getOfertasTerminoDB(termino) {
  return Ofertas.find({ titulo: termino }).populate("productos");
}
async function addOfferDB(offer) {
  const myOffer = new Ofertas(offer);
  return myOffer.save();
}
function updateOfferDB(newOffer, id) {
  return Ofertas.findByIdAndUpdate(id, newOffer, {
    new: true,
    runValidators: true,
    context: "query",
  });
}

module.exports = {
  getOfferStateDB,
  addOfferDB,
  getOfferIdDB,
  updateOfferDB,
  getOfertasTerminoDB,
};
