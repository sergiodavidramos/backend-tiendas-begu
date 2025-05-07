const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const roleValidator = {
  values: [
    "ADMIN-ROLE",
    "CLIENT-ROLE",
    "DELIVERY-ROLE",
    "GERENTE-ROLE",
    "CAJERO-ROLE",
    "ALMACEN-ROLE",
    "USER-ROLE",
  ],
  message: "{VALUE} el rol asignado no es valido",
};
const Schema = mongoose.Schema;
const userSchema = new Schema({
  idPersona: {
    type: Schema.Types.ObjectId,
    ref: "personas",
    require: [true, "El id de la persona es necesario"],
  },
  direccion: [
    { type: Schema.Types.ObjectId, ref: "direcciones", required: false },
  ],
  favoritos: [
    {
      type: Schema.Types.ObjectId,
      ref: "productos",
      require: false,
    },
  ],
  idSucursal: {
    type: Schema.Types.ObjectId,
    ref: "sucursales",
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "EL Email es necesario"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es necesario"],
  },
  cuenta: {
    type: Number,
    default: 0,
  },
  phone: {
    type: Number,
    unique: false,
    // required: [true, 'El número de celular en necesario'],
  },
  img: { type: String, require: false },
  google: { type: Boolean, default: false },
  facebook: { type: Boolean, default: false },
  role: { type: String, default: "CLIENT-ROLE", enum: roleValidator },
  personal: { type: Boolean, default: false },
  status: { type: Boolean, default: true },
  numeroCelularVerificado: { type: Boolean, default: false },
});
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};
userSchema.plugin(uniqueValidator, { message: "{PATH} debe ser único" });
module.exports = mongoose.model("usuarios", userSchema);
