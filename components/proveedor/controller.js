const {
  addProveedorDB,
  findProveedorWithTerminoDB,
  updateProveedorDB,
  deleteProveedorDB,
  findProveedorIdDB,
  getAllProveedorDB,
} = require("./store");

function addProveedor({ nombreComercial, referencia, phone, direccion = "" }) {
  if (!nombreComercial || !referencia || !phone)
    return Promise.reject({ message: "todos los datos son necesarios" });
  let proveedorDB = {
    nombreComercial: nombreComercial.replace(/\b\w/g, (l) => l.toUpperCase()),
    referencia: referencia.replace(/\b\w/g, (l) => l.toUpperCase()),
  };
  return addProveedorDB({ ...proveedorDB, phone, direccion });
}

function getAllProveedor(status) {
  if (status === "0") return getAllProveedorDB({});
  else return getAllProveedorDB({ status: status });
}

function findProveedorTermino(termino) {
  const ter = new RegExp(termino, "i");
  return findProveedorWithTerminoDB(ter);
}

function findProveedorId(id) {
  if (id) return findProveedorIdDB(id);
}
function updateProveedor(newProveedor, id) {
  if (Object.keys(newProveedor).length === 0)
    return Promise.reject({ message: "todos los datos son necesarios" });
  if (newProveedor.nombreComercial)
    newProveedor.nombreComercial = newProveedor.nombreComercial.replace(
      /\b\w/g,
      (l) => l.toUpperCase()
    );
  if (newProveedor.referencia)
    newProveedor.referencia = newProveedor.referencia.replace(/\b\w/g, (l) =>
      l.toUpperCase()
    );
  return updateProveedorDB(newProveedor, id);
}
function deleteProveedor(id) {
  return deleteProveedorDB(id);
}

module.exports = {
  addProveedor,
  findProveedorTermino,
  updateProveedor,
  deleteProveedor,
  findProveedorId,
  getAllProveedor,
};
