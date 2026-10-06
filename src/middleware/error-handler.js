function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.code === 'P2025') {
    return res.status(404).json({ error: 'Registro no encontrado' });
  }
  if (error.code === 'P2002') {
    return res.status(409).json({ error: 'Ya existe un registro con ese valor único' });
  }
  if (
    error.code === 'P2003' ||
    error.message.includes('violates RESTRICT setting of foreign key constraint')
  ) {
    return res.status(409).json({ error: 'La referencia no existe o está siendo utilizada' });
  }
  if (error.status === 400 || error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: error.status === 400 ? error.message : 'JSON inválido' });
  }

  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = errorHandler;