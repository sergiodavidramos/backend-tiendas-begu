const {
  addSucursalDB,
  getSucursalesDB,
  updateSucursalDB,
  getSucursalIdDB,
} = require("./store");
const fetch = require("node-fetch");
require("dotenv").config();
function addSucursal(
  {
    nombre,
    direccion,
    lat,
    lon,
    referencia,
    state,
    horaApertura,
    horaCierre,
    descripcion,
    administrador,
  },
  autToken
) {
  if (
    !nombre ||
    !direccion ||
    !lat ||
    !lon ||
    !horaApertura ||
    !horaCierre ||
    !administrador
  )
    return Promise.reject({ message: "Todos los datos son necesarios" });
  const sucursal = {
    nombre,
    state,
    horaApertura,
    horaCierre,
    descripcion,
    administrador,
  };
  const datosDireccion = {
    direccion,
    lat,
    lon,
    referencia,
  };
  return new Promise(async (resolve, reject) => {
    const direc = await fetch(`${process.env.API_URL}/direction`, {
      method: "POST",
      body: JSON.stringify(datosDireccion),
      headers: {
        Authorization: autToken,
        "Content-Type": "application/json",
      },
    });
    const datos = await direc.json();
    if (datos.error || !datos.body._id)
      return reject({ message: "Error al registrar la dirección" });
    addSucursalDB({ ...sucursal, direccion: datos.body._id })
      .then((sucursal) => resolve(sucursal))
      .catch((err) => reject(err));
  });
}

function getSucursales() {
  return getSucursalesDB();
}
function getSucursalId(id) {
  if (!id) return Promise.reject({ message: "El id es necesario" });
  return getSucursalIdDB(id);
}

function updateSucursal(id, sucursal, user) {
  const datosDireccion = {
    direccion: sucursal.direccion,
    lat: sucursal.lat,
    lon: sucursal.lon,
    referencia: sucursal.referencia,
  };
  var datosSucursal = {
    nombre: sucursal.nombre,
    direccion: sucursal.idDireccion,
    state: sucursal.state,
    descripcion: sucursal.descripcion,
    horaApertura: sucursal.horaApertura,
    horaCierre: sucursal.horaCierre,
    administrador: sucursal.administrador,
  };
  if (sucursal.img) {
    datosSucursal = {
      img: sucursal.img,
    };
  }
  var updateDireccion = fetch(
    `${process.env.API_URL}/direction/${sucursal.idDireccion}`,
    {
      method: "PATCH",
      body: JSON.stringify(datosDireccion),
      headers: {
        "Content-type": "application/json",
        Authorization: user,
      },
    }
  ).then((datos) => {
    return datos.json();
  });
  if (!id || !sucursal)
    return Promise.reject({ message: "Todos los datos son necesarios" });
  return Promise.all([updateSucursalDB(datosSucursal, id), updateDireccion]);
}
module.exports = {
  addSucursal,
  getSucursales,
  updateSucursal,
  getSucursalId,
};
