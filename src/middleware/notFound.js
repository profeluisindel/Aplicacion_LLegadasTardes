const HttpError = require('../controllers/httpError');

function notFound(_req, _res, next) {
  next(new HttpError(404, 'NOT_FOUND', 'La ruta solicitada no existe.'));
}

module.exports = notFound;
