const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = require("./network/routes");
const db = require("./db");
const cors = require("cors");
const errors = require("./network/errors");
const server = require("http").Server(app);
require("dotenv").config();

const allowedOrigins = process.env.CORS || "";
const allowedOriginsArray = allowedOrigins
  .split(",")
  .map((item) => item.trim());

var corsOptions = {
  origin: allowedOriginsArray,
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
db(process.env.DB_URL);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router(app);
app.use(errors);
server.listen(process.env.PORT, () => {
  console.log("Servidor escuchando en el Puerto: ", process.env.PORT);
});
