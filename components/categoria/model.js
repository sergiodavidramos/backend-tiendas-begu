const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre de la categoria es necesario"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "La descripcion es necesario"],
  },
  status: {
    type: Boolean,
    default: true,
  },
});
module.exports = mongoose.model("categorias", categorySchema);
