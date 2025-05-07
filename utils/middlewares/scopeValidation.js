function scopeValidation(scope) {
  return function (req, res, next) {
    if (!req.user || (req.user && !req.user.role)) {
      next('Missing scope')
    }
    const access = scope
      .map((allowedScope) => req.user.role.includes(allowedScope))
      .find((allowed) => Boolean(allowed))

    if (access) {
      next()
    } else {
      res.sendStatus(401)
      //   next();
    }
  }
}

module.exports = scopeValidation
