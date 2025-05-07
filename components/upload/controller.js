const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
require("dotenv").config();
function subirFoto(req) {
  const tipo = req.params.tipo;
  const id = req.params.id;
  const tiposValidos = ["user", "producto", "categoria", "oferta", "sucursal"];
  const token = req.headers.authorization.split(" ")[1];
  return new Promise((resolve, reject) => {
    if (req.user.role !== "GERENTE-ROLE")
      if (id !== req.user._id.toString() && tipo === "user")
        return reject({
          message: "No puedes cambiar la foto de otro usuario",
        });
    if (tiposValidos.indexOf(tipo) < 0)
      return reject({ message: "Tipo de coleccion no es valido" });
    if (!req.files)
      return reject({
        message: "No selecciono nada debe seleccionar una imagen",
      });
    let archivo = req.files.imagen;
    const nombreCortado = [];
    const extencionArchivo = [];
    let cont = 0;
    if (archivo.length === undefined) archivo = [archivo];
    for (const data of archivo) {
      nombreCortado.push(data.name.split(".")[1]);
      extencionArchivo.push(nombreCortado[cont]);
      cont++;
    }
    if (verificarExtencion(extencionArchivo))
      return reject({ message: "Extencion de la imagen no valida" });

    const nombreArchivo = [];
    const path = [];
    for (let i = 0; i < extencionArchivo.length; i++) {
      nombreArchivo.push(
        `${id}-${new Date().getMilliseconds() + i}.${extencionArchivo[i]}`
      );
      path.push(`./uploads/${tipo}/${nombreArchivo[i]}`);
      archivo[i].mv(path[i], (err) => {
        if (err) {
          return reject(err);
        }
      });
    }

    resolve(subirPorTipo(tipo, id, nombreArchivo, token));
  });
}
function verificarExtencion(extencion) {
  const extencionesValidas = ["png", "jpg", "gif", "jpeg", "svg"];
  for (const data of extencion) {
    if (extencionesValidas.indexOf(data) < 0) {
      return true;
    }
  }
  return false;
}
async function subirPorTipo(tipo, id, nombreArchivo, token) {
  try {
    switch (tipo) {
      case "user": {
        const p = await fetch(`${process.env.API_URL}/user?id=${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const usuario = await p.json();
        const pathViejo = "./uploads/user/" + usuario.body[0][0].img;
        if (fs.existsSync(pathViejo)) fs.unlinkSync(pathViejo);
        const user = await fetch(`${process.env.API_URL}/user/${id}`, {
          method: "PATCH",
          body: JSON.stringify({
            img: nombreArchivo[0],
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const u = await user.json();
        return u.body;
      }
      case "producto": {
        const p = await fetch(`${process.env.API_URL}/productos?id=${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const producto = await p.json();
        const pathViejo = producto.body[0][0].img;
        if (pathViejo.length > 0) {
          for (const data of pathViejo) {
            if (fs.existsSync(`./uploads/producto/${data}`))
              fs.unlinkSync(`./uploads/producto/${data}`);
          }
        }
        const produc = await fetch(`${process.env.API_URL}/productos/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ img: nombreArchivo }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const pro = await produc.json();

        return pro.body;
      }
      case "categoria": {
        const categoriaDB = await fetch(
          `${process.env.API_URL}/categoria/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const categoria = await categoriaDB.json();
        const pathViejo = "./uploads/categoria/" + categoria.body.img;
        if (fs.existsSync(pathViejo)) fs.unlinkSync(pathViejo);
        const cate = await fetch(`${process.env.API_URL}/categoria/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ img: nombreArchivo[0] }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const cateDate = await cate.json();
        return cateDate.body;
      }
      case "oferta": {
        const ofertaDB = await fetch(`${process.env.API_URL}/offers/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const oferta = await ofertaDB.json();
        const pathViejo = "./uploads/oferta/" + oferta.body.img;
        if (fs.existsSync(pathViejo)) fs.unlinkSync(pathViejo);
        const ofer = await fetch(`${process.env.API_URL}/offers/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ img: nombreArchivo[0] }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const ofertDate = await ofer.json();
        return ofertDate.body;
      }
      case "sucursal": {
        const sucursalDB = await fetch(
          `${process.env.API_URL}/sucursal/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const sucursal = await sucursalDB.json();
        const pathViejo = "./uploads/sucursal/" + sucursal.body.img;
        if (fs.existsSync(pathViejo)) fs.unlinkSync(pathViejo);
        const suc = await fetch(`${process.env.API_URL}/sucursal/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ img: nombreArchivo[0] }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const sucursalDate = await suc.json();
        return sucursalDate.body;
      }
    }
  } catch (error) {
    console.log("SSSS", error);
    return Promise.reject({ message: "No se pudo actualizar la foto" });
  }
}

function retornaImagen(req, res) {
  const tipo = req.params.tipo;
  const foto = req.params.foto;
  const pathImg = path.join(__dirname, `../../uploads/${tipo}/${foto}`);
  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathImg = path.join(__dirname, `../../uploads/no-img.jpg`);
    res.sendFile(pathImg);
  }
}
module.exports = {
  subirFoto,
  retornaImagen,
};
