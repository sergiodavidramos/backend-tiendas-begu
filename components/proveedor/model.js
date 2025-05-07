const mongoose = require('mongoose')

const Schema = mongoose.Schema
const proveedorSchema = new Schema({
  nombreComercial: {
    type: String,
    unique: true,
    required: true,
  },
  referencia: {
    type: String,
  },
  phone: {
    type: Number,
    unique: true,
    required: [true, 'El número de celular en necesario'],
  },
  direccion: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
})

module.exports = mongoose.model('proveedor', proveedorSchema)
