const db = require("mongoose");
db.Promise = global.Promise;

module.exports = async function connect(url) {
  await db.connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    },
    (err, res) => {
      if (err) throw err;
      console.log("Base de datos: \x1b[32m%s\x1b[0m", "online");
    }
  );
};
