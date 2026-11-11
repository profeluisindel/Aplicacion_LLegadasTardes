const HttpError = require('./httpError');

function invalid(message) {
  throw new HttpError(400, 'VALIDATION_ERROR', message);
}

function parseId(value, label = 'id') {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) {
    invalid(`${label} debe ser un entero positivo.`);
  }
  return id;
}

function parseText(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    invalid(`${label} debe ser un texto no vacío.`);
  }
  return value.trim();
}

function parseDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    invalid('fecha debe tener el formato YYYY-MM-DD.');
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    invalid('fecha no es válida.');
  }
  return date;
}

function parseTime(value) {
  if (typeof value !== 'string' || !/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.test(value)) {
    invalid('horaLlegada debe tener formato HH:mm o HH:mm:ss.');
  }
  const time = value.length === 5 ? `${value}:00` : value;
  return new Date(`1970-01-01T${time}.000Z`);
}

function parseBody(body, fields, requiredFields) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    invalid('El cuerpo de la solicitud debe ser un objeto JSON.');
  }

  const unknownFields = Object.keys(body).filter((field) => !Object.hasOwn(fields, field));
  if (unknownFields.length > 0) {
    invalid(`Campo(s) no permitido(s): ${unknownFields.join(', ')}.`);
  }

  for (const field of requiredFields) {
    if (!Object.hasOwn(body, field)) invalid(`El campo ${field} es obligatorio.`);
  }

  const payload = {};
  for (const [field, parser] of Object.entries(fields)) {
    if (Object.hasOwn(body, field)) payload[field] = parser(body[field]);
  }

  if (Object.keys(payload).length === 0) invalid('Debe enviar al menos un campo para actualizar.');
  return payload;
}

module.exports = { parseId, parseText, parseDate, parseTime, parseBody };
