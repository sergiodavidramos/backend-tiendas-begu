const {
  getPersonDB,
  addPersonDB,
  findPersonWithTerDB,
  updatePersonDB,
  deletePersonDB,
  updatePuntosDB,
} = require("./store");

function getPerson(id, state, ci, des, limit) {
  let filterPerson = {};
  const desde = Number(des) || 0;
  const lim = Number(limit) | 10;
  if (id !== null) filterPerson = { _id: id };
  if (ci !== null) filterPerson = { ci: ci };
  if (state !== null) filterPerson = { status: state };
  return getPersonDB(filterPerson, desde, lim);
}
function addPerson({ nombre_comp, ci }) {
  let personDB = {
    nombre_comp: nombre_comp.replace(/\b\w/g, (l) => l.toUpperCase()),
  };
  if (ci) personDB = { ...personDB, ci };
  return addPersonDB(personDB);
}

function findPersonWithTer(termino) {
  const ter = new RegExp(termino, "i");
  return findPersonWithTerDB(ter);
}

function updatePerson(newPerson, id) {
  if (Object.keys(newPerson).length === 0)
    return Promise.reject({
      message: "Los datos son requeridos para ser actualizados",
    });
  if (newPerson.puntos) return updatePuntosDB(newPerson, id);
  if (newPerson.nombre_comp)
    newPerson.nombre_comp = newPerson.nombre_comp.replace(/\b\w/g, (l) =>
      l.toUpperCase()
    );
  return updatePersonDB(newPerson, id);
}
function deletePerson(id) {
  return deletePersonDB(id);
}

module.exports = {
  getPerson,
  addPerson,
  findPersonWithTer,
  updatePerson,
  deletePerson,
};
