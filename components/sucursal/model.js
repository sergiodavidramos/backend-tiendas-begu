const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const sucursalSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre de la sucursal es necesario"],
    unique: true,
  },
  direccion: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "direcciones",
  },
  state: {
    type: Boolean,
    default: true,
  },
  img: {
    type: String,
    require: false,
  },
  horaApertura: {
    type: String,
    required: [true, "La hora de apertura es necesaria"],
  },
  horaCierre: {
    type: String,
    require: [true, "La hora de cierre es necesaria"],
  },

  descripcion: {
    type: String,
  },
  administrador: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "usuarios",
  },
});
module.exports = mongoose.model("sucursales", sucursalSchema);
