const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const detalleCompraVenta = new Schema({
  detalle: [
    {
      producto: {
        type: Schema.Types.ObjectId,
        ref: "productos",
        required: true,
      },
      cantidad: { type: Number, required: true },
      subTotal: { type: Number, require: true },
      numeroLote: {
        type: String,
        required: false,
      },
      tipoVenta: { type: String, required: false },
      precioVenta: { type: Number, required: false },
      descuento: { type: Number, required: false },
      idSucursal: {
        type: Schema.Types.ObjectId,
        ref: "sucursales",
        required: true,
      },
    },
  ],
  venta: {
    type: Boolean,
    default: true,
  },
  fecha: { type: Date, required: true },
});

module.exports = mongoose.model("detallecompraventas", detalleCompraVenta);
