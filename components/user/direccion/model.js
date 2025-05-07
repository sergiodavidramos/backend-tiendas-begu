const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const directionSchema = new Schema({
  nombre: {
    type: String,
    required: false,
    unique: false,
    default: "Casa",
  },
  direccion: {
    type: String,
    required: [true, "La direccion es necesaria"],
  },
  lat: { type: Number, require: [true, "La latitud es necesaria"] },
  lon: { type: Number, require: [true, "La longitud es necesaria"] },
  referencia: {
    type: String,
    required: [true, "La refencia es necesaria"],
  },
});

module.exports = mongoose.model("direcciones", directionSchema);
