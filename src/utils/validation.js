function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw badRequest('El ID debe ser un entero positivo');
  }
  return id;
}

function validatePayload(body, allowedFields, requiredFields = []) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw badRequest('El cuerpo de la solicitud debe ser un objeto JSON');
  }

  const fields = Object.keys(body);
  const unknownFields = fields.filter((field) => !allowedFields.includes(field));
  if (unknownFields.length > 0) {
    throw badRequest(`Campos no permitidos: ${unknownFields.join(', ')}`);
  }

  const missingFields = requiredFields.filter((field) => body[field] === undefined);
  if (missingFields.length > 0) {
    throw badRequest(`Faltan campos requeridos: ${missingFields.join(', ')}`);
  }

  if (fields.length === 0) {
    throw badRequest('Debe proporcionar al menos un campo');
  }

  return body;
}

function validateStrings(body, fields, maxLengths) {
  const data = {};
  for (const field of fields) {
    if (body[field] === undefined) continue;
    if (typeof body[field] !== 'string' || body[field].trim().length === 0) {
      throw badRequest(`${field} debe ser un texto no vacío`);
    }
    const value = body[field].trim();
    if (value.length > maxLengths[field]) {
      throw badRequest(`${field} no puede superar ${maxLengths[field]} caracteres`);
    }
    data[field] = value;
  }
  return data;
}

module.exports = { badRequest, parseId, validatePayload, validateStrings };