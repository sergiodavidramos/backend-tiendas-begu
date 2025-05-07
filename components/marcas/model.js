const mongoose = require('mongoose')

const Schema = mongoose.Schema
const marcaSchema = new Schema({
  nombre: {
    type: String,
    require: [true, 'El nombre de la marca es necesario'],
  },
  status: {
    type: Boolean,
    default: true,
  },
})

module.exports = mongoose.model('marcas', marcaSchema)
