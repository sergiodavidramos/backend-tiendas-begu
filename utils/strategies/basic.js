const passport = require("passport");
const { BasicStrategy } = require("passport-http");
const bcrypt = require("bcrypt");
const User = require("../../components/user/model");

passport.use(
  new BasicStrategy(async (email, password, cb) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return cb({ message: "Usuario no encontrado" }, false);
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return cb({ message: "Usuario no encontrado" }, false);
      }

      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  })
);
