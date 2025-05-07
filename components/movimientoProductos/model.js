const mongoose = require("mongoose");
const arrayUniquePlugin = require("mongoose-unique-array");
const Schema = mongoose.Schema;
const movimientoSchema = new Schema({
  movimiento: [
    {
      productos: {
        type: Schema.Types.ObjectId,
        ref: "productos",
        required: true,
      },
      cantidad: { type: Number, required: true },
      numeroLote: {
        type: String,
        required: false,
      },
      fechaVencimiento: {
        type: Date,
        required: false,
      },
    },
  ],
  sucursalOrigen: {
    type: Schema.Types.ObjectId,
    ref: "sucursales",
    required: true,
  },
  sucursalDestino: {
    type: Schema.Types.ObjectId,
    ref: "sucursales",
    required: true,
  },
  enviaUsuario: {
    type: Schema.Types.ObjectId,
    ref: "usuarios",
    required: true,
  },
  recibeUsuario: {
    type: Schema.Types.ObjectId,
    ref: "usuarios",
    required: false,
  },
  fechaEnvio: { type: Date, required: true },
  fechaRecibo: { type: Date, required: false },
  estadoRecibido: { type: Boolean, default: false },
});

movimientoSchema.plugin(arrayUniquePlugin);
module.exports = mongoose.model("movimientos", movimientoSchema);
