const mongoose = require("mongoose");
const arrayUniquePlugin = require("mongoose-unique-array");
const Schema = mongoose.Schema;
const inventarioSchema = new Schema({
  producto: {
    type: Schema.Types.ObjectId,
    ref: "productos",
    required: true,
    unique: false,
  },
  stockLotes: [
    {
      lote: {
        type: Schema.Types.ObjectId,
        ref: "lotes",
        required: false,
        unique: false,
      },
    },
  ],
  stockTotal: {
    type: Number,
    required: [true, "la cantidad del stock Total es necesaria"],
    default: 0,
  },

  idSucursal: {
    type: Schema.Types.ObjectId,
    ref: "sucursales",
  },
});
inventarioSchema.plugin(arrayUniquePlugin);
module.exports = mongoose.model("inventario", inventarioSchema);
