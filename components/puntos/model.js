const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const puntosSchema = new Schema({
  valor: {
    type: Number,
    required: [true, "El Valor de los puntos es necesario"],
    unique: true,
  },
  status: { type: Boolean, default: true },
});
module.exports = mongoose.model("puntos", puntosSchema);
