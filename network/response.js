exports.success = (res, message = "Todo correcto", status = 200) => {
  res.status(status).send({ error: false, status, body: message });
};

exports.error = (res, error = "Error interno del servidor", status = 500) => {
  res.status(status).send({ error: true, status, body: error });
};

exports.pdf = (res, message = "Todo correcto", status = 200) => {
  res.setHeader("Content-Type", "application/pdf");
  res.send(message);
};
