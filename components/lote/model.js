const mongoose = require("mongoose");
const arrayUniquePlugin = require("mongoose-unique-array");
const Schema = mongoose.Schema;
const loteSchema = new Schema({
  numeroLote: {
    type: String,
    required: [true, "El nombre del lote es necesario"],
    unique: false,
  },
  stock: { type: Number, default: 0 },
  fechaVencimiento: {
    type: Date,
    required: [true, "La fecha de vencimeinto es necesario"],
  },
});
loteSchema.plugin(arrayUniquePlugin);
module.exports = mongoose.model("lotes", loteSchema);
