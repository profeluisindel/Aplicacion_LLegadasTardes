function check(_req, res) {
  res.status(200).json({
    message: 'API de Colegio La Pulida S.A. funcionando correctamente.'
  });
}

module.exports = { check };
