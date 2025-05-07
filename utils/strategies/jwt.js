const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const User = require("../../components/user/model");
require("dotenv").config();

passport.use(
  new Strategy(
    {
      secretOrKey: process.env.AUTH_JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async function (tokenPayload, cb) {
      try {
        const user = await User.findOne({
          email: tokenPayload.email,
        }).populate("idPersona", "nombre_comp");
        if (!user) return cb({ message: "Usuario no encontrado" }, false);

        return cb(null, user);
      } catch (err) {
        cb(err);
      }
    }
  )
);
