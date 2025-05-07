const {
  addProductDB,
  getAllProductDB,
  getFilterIdAndPaginateProductDB,
  deleteProductDB,
  updateProductDB,
  findProductDB,
  findCategoriaProductDB,
  findForCodeDB,
  updateStockProductDB,
  informacionFiltroDB,
  updateFavoritoProductDB,
  productosFiltradosDB,
  addOfertaProductoDB,
  produtosFiltradosPorDescuentoDB,
  findDestacadosPrincipalesDB,
} = require("./store");
ObjectId = require("mongodb").ObjectID;

function getFilterIdAndPaginateProduct(id, des, limit, orden = false) {
  let filterProduct = {};
  //   = { stock: { $gt: 0 } };
  const desde = Number(des) || 0;
  const lim = Number(limit) || 12;
  if (id !== null) filterProduct._id = id;
  if (orden === false || orden === "")
    return getFilterIdAndPaginateProductDB(filterProduct, desde, lim, {
      _id: -1,
    });
  else {
    switch (orden) {
      case "0":
        return getFilterIdAndPaginateProductDB(filterProduct, desde, lim, {
          like: -1,
        });
      case "1":
        return getFilterIdAndPaginateProductDB(filterProduct, desde, lim, {
          precioVenta: 1,
        });
      case "2":
        return getFilterIdAndPaginateProductDB(filterProduct, desde, lim, {
          precioVenta: -1,
        });
      case "3":
        return getFilterIdAndPaginateProductDB(filterProduct, desde, lim, {
          name: 1,
        });
      case "4":
        return getFilterIdAndPaginateProductDB(filterProduct, desde, lim, {
          descuento: -1,
        });
      case "5":
        return getFilterIdAndPaginateProductDB(filterProduct, desde, lim, {
          descuento: 1,
        });
      default:
        return getFilterIdAndPaginateProductDB(filterProduct, desde, lim, {
          _id: -1,
        });
    }
  }
}
function getAllProduct() {
  return getAllProductDB();
}
function findProduct(ter) {
  const termino = new RegExp(ter, "i");
  return findProductDB(termino);
}
function findCategoriaProduct(categoria, pagina, orden = false) {
  if (orden === false || orden === "")
    return findCategoriaProductDB(categoria, pagina, {});
  else {
    switch (orden) {
      case "0":
        return findCategoriaProductDB(categoria, pagina, { like: -1 });
      case "1":
        return findCategoriaProductDB(categoria, pagina, { precioVenta: 1 });
      case "2":
        return findCategoriaProductDB(categoria, pagina, { precioVenta: -1 });
      case "3":
        return findCategoriaProductDB(categoria, pagina, { name: 1 });
      case "4":
        return findCategoriaProductDB(categoria, pagina, { descuento: -1 });
      case "5":
        return findCategoriaProductDB(categoria, pagina, { descuento: 1 });
      default:
        return findCategoriaProductDB(categoria, pagina, {});
    }
  }
}
function findDestacadosPrincipales(pagina = false, orden = false) {
  if (orden === false || orden === "")
    return findDestacadosPrincipalesDB(pagina, { cantidadVendidos: -1 });
  else {
    switch (orden) {
      case "0":
        return findDestacadosPrincipalesDB(pagina, { like: -1 });
      case "1":
        return findDestacadosPrincipalesDB(pagina, { precioVenta: 1 });
      case "2":
        return findDestacadosPrincipalesDB(pagina, { precioVenta: -1 });
      case "3":
        return findDestacadosPrincipalesDB(pagina, { name: 1 });
      case "4":
        return findDestacadosPrincipalesDB(pagina, { descuento: -1 });
      case "5":
        return findDestacadosPrincipalesDB(pagina, { descuento: 1 });
      default:
        return findDestacadosPrincipalesDB(pagina, { cantidadVendidos: -1 });
    }
  }
}
function informacionFiltro({ categoria = false }) {
  let category = false;
  if (categoria) category = ObjectId(categoria);
  return informacionFiltroDB(category);
}
function productosFiltrados({
  orden = 0,
  categoria = false,
  proveedor = false,
  precio = [0, 1000],
  descuento = [0, 200],
  pagina = 1,
}) {
  let ordenBan = {};
  switch (parseInt(orden)) {
    case 0:
      ordenBan = { cantidadVendidos: -1 };

      break;
    case 1:
      ordenBan = { precioVenta: 1 };
      break;
    case 2:
      ordenBan = { precioVenta: -1 };
      break;
    case 3:
      ordenBan = { name: 1 };
      break;
    case 4:
      ordenBan = { descuento: -1 };
      break;
    case 5:
      ordenBan = { descuento: 1 };
      break;
    default:
      ordenBan = { cantidadVendidos: -1 };
  }
  return productosFiltradosDB(
    ordenBan,
    categoria,
    proveedor,
    precio,
    descuento,
    pagina
  );
}
function findForCode(code) {
  if (code) return findForCodeDB(code);
  else {
    return Promise.reject({
      message: "EL codigo del producto debe ser un numero",
    });
  }
}
function produtosFiltradosPorDescuento() {
  return produtosFiltradosPorDescuentoDB();
}
function addProduct(product) {
  const {
    code,
    name,
    detail,
    stock,
    precioCompra,
    precioVenta,
    descuento,
    category,
    img,
    tipoVenta,
    ventaOnline,
  } = product;
  if (
    !code ||
    !name ||
    !stock ||
    !precioCompra ||
    !precioVenta ||
    !tipoVenta ||
    !category
  )
    return Promise.reject({ message: "Todos los datos son necesarios" });
  const productDB = {
    code: parseInt(code),
    name: name.replace(/\b\w/g, (l) => l.toUpperCase()),
    detail,
    stock,
    precioCompra,
    precioVenta,
    descuento,
    category,
    img,
    tipoVenta,
    ventaOnline,
  };
  return addProductDB(productDB);
}
function updateProduct(
  desStock = false,
  like = false,
  movimiento = false,
  newProduct,
  id
) {
  if (desStock) return updateStockProductDB(desStock, id, movimiento);
  if (like) return updateFavoritoProductDB(id);
  if (Object.keys(newProduct).length === 0 && !id)
    return Promise.reject({
      message: "Todos los datos son requeridos para ser Actualizados",
    });
  return updateProductDB(newProduct, id);
}
function deleteProduct(id) {
  return deleteProductDB(id);
}
function addOfertaProducto(idProducto = false, descuento = 0, agregar = true) {
  if (!idProducto) {
    return Promise.reject({ message: "Todos los datos son necesarios" });
  }
  return addOfertaProductoDB(idProducto, parseFloat(descuento), agregar);
}
module.exports = {
  getFilterIdAndPaginateProduct,
  getAllProduct,
  findProduct,
  findCategoriaProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  findForCode,
  productosFiltrados,
  informacionFiltro,
  addOfertaProducto,
  produtosFiltradosPorDescuento,
  findDestacadosPrincipales,
};
