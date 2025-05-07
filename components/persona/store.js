const Model = require("./model");

function getPersonDB(filterPerson, des, limit) {
  return new Promise((resolve, reject) => {
    Model.find(
      Object.keys(filterPerson).length === 0 ? { status: true } : filterPerson
    )
      .populate("direccion", "direccion lat lon")
      .skip(des)
      .limit(limit)
      .exec((err, persons) => {
        if (err) return reject(err);
        Model.countDocuments({ status: true }, (err, count) => {
          if (err) return reject(err);
          resolve({ persons, count });
        });
      });
  });
}
async function addPersonDB(person) {
  const myPerson = new Model(person);
  return myPerson.save();
}
async function findPersonWithTerDB(termino) {
  return Model.aggregate([
    {
      $lookup: {
        from: "usuarios",
        localField: "_id",
        foreignField: "idPersona",
        as: "usuario",
      },
    },
    {
      $match: { nombre_comp: termino },
    },
  ]).exec();
}
async function updatePersonDB(newPerson, id) {
  return Model.findByIdAndUpdate(id, newPerson, {
    new: true,
    runValidators: true,
    context: "query",
  });
}
async function updatePuntosDB({ puntos }, id) {
  return Model.findByIdAndUpdate(
    id,
    { $inc: { puntos, compras: 1 } },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  );
}
async function deletePersonDB(id) {
  return Model.findByIdAndUpdate(id, { status: false }, { new: true });
}
module.exports = {
  getPersonDB,
  addPersonDB,
  findPersonWithTerDB,
  updatePersonDB,
  deletePersonDB,
  updatePuntosDB,
};
