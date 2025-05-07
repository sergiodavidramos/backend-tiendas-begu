const passport = require('passport')
const { Strategy: FacebookStrategy } = require('passport-facebook')
require('dotenv').config()

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: '/login/callback',
      profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    async function (accessToken, refreshToken, { _json: profile }, done) {
      if (!profile.email) {
        return done('No se pudo obtener el email', false)
      }
      const user = {
        nombre_comp: profile.name,
        email: profile.email,
        password: profile.id,
        img: profile.picture.data.url,
      }
      return done(null, user)
    }
  )
)
