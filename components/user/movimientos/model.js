const mongoose = require('mongoose')
const Schema = mongoose.Schema
const movimientosSchema = new Schema({
    idUser:{
        type: Schema.Types.ObjectId, ref: 'Usuario',
        require: [true, 'El usuario es necesario']
    },
    fecha:{type: Date, require: true},
    monto:{type: Number, require: true}
})

module.exports = mongoose.model('Movimiento', movimientosSchema)