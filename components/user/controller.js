const {
  getUserDB,
  addUserDB,
  updateUserDB,
  deleteUserDB,
  findUserDB,
  getUserRoleDB,
  addDireccionDB,
} = require("./store");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");
require("dotenv").config();

function getUser(id, state, ci, des, limit) {
  let filterUser = {};
  const desde = Number(des) || 0;
  const lim = Number(limit) || 10;
  if (id !== null) filterUser = { _id: id };
  if (ci !== null) filterUser = { ci: new RegExp(ci, "i") };
  if (state !== null) filterUser = { status: state };
  return getUserDB(filterUser, desde, lim);
}
function getUserRole(role) {
  let filterRole = {
    role: {
      $in: [
        "ADMIN-ROLE",
        "USER-ROLE",
        "DELIVERY-ROLE",
        "GERENTE-ROLE",
        "ALMACEN-ROLE",
      ],
    },
  };
  if (role !== null) filterRole = { role: role };
  return getUserRoleDB(filterRole);
}
function findUser(ter) {
  const termino = new RegExp(ter, "i");
  return findUserDB(termino);
}

function addUser(
  {
    nombre_comp,
    ci,
    email,
    password,
    phone,
    role,
    personal,
    idSucursal,
    direccion,
    lat,
    lon,
    referencia,
  },
  userToken
) {
  if (
    (!nombre_comp,
    !ci,
    !email,
    !password,
    !phone,
    !direccion,
    !lat,
    !lon,
    !referencia)
  )
    return Promise.reject({ message: "Todos los datos son obligatorios" });

  const person = {
    nombre_comp,
    ci,
  };
  const datosDireccion = {
    direccion,
    lat: parseInt(lat),
    lon: parseInt(lon),
    referencia,
  };
  if (password.length < 6)
    return Promise.reject({
      message: "La contraseña debe tener al menos 6 caracteres",
    });
  let userDB = {
    email,
    password: bcrypt.hashSync(password, 5),
    phone,
  };

  if (personal === "1") {
    if (!idSucursal || !role || role === "GERENTE-ROLE")
      return Promise.reject({
        message: "Todos los datos son requeridos o no puede asignar ese rol",
      });
    userDB = { ...userDB, personal: true, idSucursal, role };
  }
  const per = fetch(`${process.env.API_URL}/person`, {
    method: "POST",
    body: JSON.stringify(person),
    headers: { "Content-Type": "application/json" },
  });
  const dir = fetch(`${process.env.API_URL}/direction`, {
    method: "POST",
    body: JSON.stringify(datosDireccion),
    headers: {
      Authorization: userToken,
      "Content-Type": "application/json",
    },
  });
  return new Promise(async (resolve, reject) => {
    Promise.all([per, dir]).then(async ([res1, res2]) => {
      const data1 = await res1.json();
      const data2 = await res2.json();
      if (data1.error || data2.error) {
        return reject({
          message: "error al registrar la persona o direccion del usuario",
        });
      }

      addUserDB({
        ...userDB,
        idPersona: data1.body._id,
        direccion: data2.body._id,
      })
        .then((user) => {
          return resolve(user);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  });
}

function addClient({ nombre_comp, ci, email, password, phone }) {
  if (!nombre_comp || !email || !password)
    return Promise.reject({ message: "Los datos son obligatorios" });
  const person = {
    nombre_comp,
  };
  if (ci) person.ci = ci;
  if (password.length < 6)
    return Promise.reject({
      message: "La contraseña debe tener al menos 6 caracteres",
    });
  let userDB = {
    email,
    password: bcrypt.hashSync(password, 5),
    phone,
  };
  return new Promise(async (resolve, reject) => {
    try {
      const persona = await fetch(`${process.env.API_URL}/person`, {
        method: "POST",
        body: JSON.stringify(person),
        headers: { "Content-Type": "application/json" },
      });
      const datos = await persona.json();
      if (datos.error || !datos.body._id)
        return reject({
          message: `Error al crear la persona ${datos.body ? datos.body : ""}`,
        });
      addUserDB({ ...userDB, idPersona: datos.body._id })
        .then((user) => {
          resolve(user);
        })
        .catch((err) => reject(err));
    } catch (err) {
      return reject(err);
    }
  });
}

function updateUser(
  newUser,
  idUser,
  userToken,
  bodyPhone = false,
  userPhone = false
) {
  if (Object.keys(newUser).length === 0)
    return Promise.reject({
      message: "Los datos son requeridos para ser actualizados",
    });
  if (newUser.password) {
    newUser.password = bcrypt.hashSync(newUser.password, 5);
  }
  if (bodyPhone) {
    if (parseInt(newUser.phone) !== userPhone) {
      newUser.numeroCelularVerificado = false;
    }
  }
  return new Promise(async (resolve, reject) => {
    if (newUser.nombre_comp || newUser.ci) {
      const persona = await fetch(
        `${process.env.API_URL}/person/${newUser.idPersona}`,
        {
          method: "PATCH",
          body: JSON.stringify(newUser),
          headers: {
            "Content-type": "application/json",
            Authorization: userToken,
          },
        }
      );
      const datosPersona = await persona.json();
      if (datosPersona.error || !datosPersona.body._id)
        return reject({
          message: `Error al editar la persona ${
            datosPersona.body ? datosPersona.body : ""
          }`,
        });
    }
    updateUserDB(newUser, idUser)
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
function deleteUser(id) {
  return deleteUserDB(id);
}
function addDireccion({ direccionId, userId }) {
  if (!direccionId)
    return Promise.reject({ message: "Todos los datos son necesarios" });
  return addDireccionDB(direccionId, userId);
}

module.exports = {
  getUser,
  addUser,
  updateUser,
  deleteUser,
  findUser,
  getUserRole,
  addClient,
  addDireccion,
};
