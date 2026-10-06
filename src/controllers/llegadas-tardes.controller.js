const repository = require('../repositories/llegadas-tardes.repository');
const {
  badRequest,
  parseId,
  validatePayload,
} = require('../utils/validation');

const fields = [
  'idEstudiente',
  'idGrado',
  'horaLlegadaTardia',
  'fecha',
  'detalle',
];

function parseTime(value) {
  if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(value)) {
    throw badRequest('horaLlegadaTardia debe tener formato HH:mm o HH:mm:ss');
  }
  const time = value.length === 5 ? `${value}:00` : value;
  return new Date(`1970-01-01T${time}.000Z`);
}

function parseDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw badRequest('fecha debe tener formato YYYY-MM-DD');
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (date.toISOString().slice(0, 10) !== value) {
    throw badRequest('fecha no es válida');
  }
  return date;
}

function arrivalData(body, requiredFields = []) {
  validatePayload(body, fields, requiredFields);
  const data = {};

  for (const field of ['idEstudiente', 'idGrado']) {
    if (body[field] !== undefined) {
      if (!Number.isInteger(body[field]) || body[field] < 1) {
        throw badRequest(`${field} debe ser un entero positivo`);
      }
      data[field] = body[field];
    }
  }

  if (body.horaLlegadaTardia !== undefined) {
    data.horaLlegadaTardia = parseTime(body.horaLlegadaTardia);
  }
  if (body.fecha !== undefined) data.fecha = parseDate(body.fecha);
  if (body.detalle !== undefined) {
    if (body.detalle !== null && typeof body.detalle !== 'string') {
      throw badRequest('detalle debe ser un texto o null');
    }
    data.detalle = body.detalle;
  }

  return data;
}

function serialize(arrival) {
  return {
    ...arrival,
    horaLlegadaTardia: arrival.horaLlegadaTardia.toISOString().slice(11, 19),
    fecha: arrival.fecha.toISOString().slice(0, 10),
  };
}

async function list(req, res) {
  res.json((await repository.findAll()).map(serialize));
}

async function getById(req, res) {
  const arrival = await repository.findById(parseId(req.params.id));
  if (!arrival) return res.status(404).json({ error: 'Llegada tarde no encontrada' });
  res.json(serialize(arrival));
}

async function create(req, res) {
  const arrival = await repository.create(arrivalData(req.body, fields.slice(0, 4)));
  res
    .status(201)
    .location(`/api/llegadas-tardes/${arrival.idLlegadaTarde}`)
    .json(serialize(arrival));
}

async function replace(req, res) {
  const arrival = await repository.update(
    parseId(req.params.id),
    arrivalData(req.body, fields.slice(0, 4))
  );
  res.json(serialize(arrival));
}

async function update(req, res) {
  const arrival = await repository.update(
    parseId(req.params.id),
    arrivalData(req.body)
  );
  res.json(serialize(arrival));
}

async function remove(req, res) {
  await repository.remove(parseId(req.params.id));
  res.status(204).end();
}

module.exports = { list, getById, create, replace, update, remove };