const mongoose = require("mongoose");
const { unique } = require("underscore");

const Schema = mongoose.Schema;
const offers = new Schema({
  idSucursal: {
    type: Schema.Types.ObjectId,
    ref: "sucursales",
    require: [true, "La sucursal es necesario"],
  },
  titulo: {
    type: String,
    unique: true,
    required: [true, "El titulo de la oferta es necesario"],
  },
  descuento: {
    type: Number,
    require: [true, "El monto de descuento es necesario"],
  },
  productos: [
    {
      type: Schema.Types.ObjectId,
      ref: "productos",
      require: [true, "El producto es necesario"],
    },
  ],
  description: {
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
  img: { type: String, require: false },
  agotarStock: {
    type: Boolean,
    default: false,
  },
  fecha: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model("ofertas", offers);
