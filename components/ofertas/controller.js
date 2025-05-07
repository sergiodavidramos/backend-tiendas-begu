const {
  addOfferDB,
  getOfferStateDB,
  getOfferIdDB,
  updateOfferDB,
  getOfertasTerminoDB,
} = require("./store");
const fetch = require("node-fetch");
function getOfferState(state) {
  const value = state === "true";
  let filterState = { mejorValor: null };
  if (state !== null) filterState = { status: value, mejorValor: null };
  return getOfferStateDB(filterState);
}
function getOfferId(id) {
  if (!id) {
    return { message: "El ID es necesario" };
  }
  return getOfferIdDB(id);
}
function getOfertasTermino(ter) {
  if (!ter) return Promise.reject({ message: "El nombre es necesario" });
  const termino = new RegExp(ter, "i");
  return getOfertasTerminoDB(termino);
}
function addOffer(offer, token) {
  const {
    idSucursal,
    titulo,
    descuento,
    producto,
    status,
    description,
    fecha,
    agotarStock,
  } = offer;
  let offerDB = {};
  if (agotarStock === true)
    offerDB = {
      idSucursal,
      titulo: titulo.replace(/\b\w/g, (l) => l.toUpperCase()),
      descuento,
      productos: producto,
      status,
      description,
      agotarStock,
    };
  else
    offerDB = {
      idSucursal,
      titulo: titulo.replace(/\b\w/g, (l) => l.toUpperCase()),
      descuento,
      productos: producto,
      status,
      description,
      agotarStock,
      fecha,
    };

  return new Promise((resolve, reject) => {
    let productosListos = [];
    addOfferDB(offerDB)
      .then(async (datos) => {
        for (const pro of datos.productos) {
          const productosConEoferta = await fetch(
            `${process.env.API_URL}/productos/agregar-oferta-producto/${pro}`,
            {
              method: "PATCH",
              body: JSON.stringify({ descuento: datos.descuento }),
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }
          );
          const datosproductos = await productosConEoferta.json();
          if (datosproductos.error)
            return reject({
              message: "Error al registrar la oferta en el producto",
            });
          productosListos.push(datosproductos);
        }
        return resolve(datos);
      })
      .catch((error) => reject(error));
  });
}
function updateOffer(newOffer, id) {
  if (Object.keys(newOffer).length === 0 && !id)
    return Promise.reject({
      message: "Los datos son requeridos para ser Actualizados",
    });
  return updateOfferDB(newOffer, id);
}

module.exports = {
  getOfferState,
  addOffer,
  getOfferId,
  updateOffer,
  getOfertasTermino,
};
