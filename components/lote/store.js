const { find } = require("underscore");
const Lote = require("./model");
async function addLoteDB(newLote) {
  return new Promise((resolve, reject) => {
    buscarLoteNumeroDB(newLote.numeroLote)
      .then((dato) => {
        if (dato.length <= 0) {
          const lote = new Lote(newLote);
          return resolve(lote.save());
        } else {
          newLote.stock = dato[0].stock + parseInt(newLote.stock);
          //   return resolve(updateLoteDB(dato[0]._id, newLote));
          updateLoteDB(dato[0]._id, newLote).then((dato) => {
            dato._doc.actualizado = true;
            return resolve(dato);
          });
        }
      })
      .catch((error) => {
        return reject(error);
      });
  });
}
async function buscarLoteNumeroDB(numero) {
  return Lote.find({ numeroLote: numero });
}
async function buscarLoteStockDB(menorQue) {
  return Lote.find({ stock: { $lt: menorQue } });
}

async function updateLoteDB(id, newLote) {
  return Lote.findByIdAndUpdate(id, newLote, {
    new: true,
    runValidators: true,
  });
}
async function actualizarStockDB(id, stock) {
  return Lote.findByIdAndUpdate(
    { _id: id },
    {
      $inc: { stock: stock },
    },
    { new: true }
  );
}

module.exports = {
  addLoteDB,
  buscarLoteNumeroDB,
  buscarLoteStockDB,
  updateLoteDB,
  actualizarStockDB,
};
