function errorHandler(error, _req, res, _next) {
  if (res.headersSent) return;

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { code: 'INVALID_JSON', message: 'El cuerpo JSON no es válido.' } });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'El cuerpo de la solicitud es demasiado grande.' } });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'No se encontró el registro solicitado.' } });
  }
  if (error.code === 'P2002' || error.code === 'P2003') {
    return res.status(409).json({ error: { code: 'CONFLICT', message: 'La operación entra en conflicto con datos existentes o relaciones.' } });
  }
  if (error.code === 'P1000' || error.code === 'P1001' || error.code === 'P1002') {
    return res.status(503).json({ error: { code: 'DATABASE_UNAVAILABLE', message: 'No se pudo completar la operación con la base de datos.' } });
  }

  const status = Number.isInteger(error.status) ? error.status : 500;
  const code = error.code || (status === 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR');
  const message = status === 500 ? 'Ocurrió un error interno.' : error.message;

  if (status === 500) console.error(error);
  return res.status(status).json({ error: { code, message } });
}

module.exports = errorHandler;
