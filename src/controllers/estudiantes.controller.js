const repository = require('../repositories/estudiantes.repository');
const {
  parseId,
  validatePayload,
  validateStrings,
} = require('../utils/validation');

const fields = ['nie', 'nombre', 'responsable', 'telefono'];
const maxLengths = { nie: 30, nombre: 150, responsable: 150, telefono: 30 };

function studentData(body, requiredFields = []) {
  validatePayload(body, fields, requiredFields);
  return validateStrings(body, fields, maxLengths);
}

async function list(req, res) {
  res.json(await repository.findAll());
}

async function getById(req, res) {
  const estudiante = await repository.findById(parseId(req.params.id));
  if (!estudiante) return res.status(404).json({ error: 'Estudiante no encontrado' });
  res.json(estudiante);
}

async function create(req, res) {
  const estudiante = await repository.create(studentData(req.body, fields));
  res.status(201).location(`/api/estudiantes/${estudiante.idEstudiente}`).json(estudiante);
}

async function replace(req, res) {
  const estudiante = await repository.update(
    parseId(req.params.id),
    studentData(req.body, fields)
  );
  res.json(estudiante);
}

async function update(req, res) {
  const estudiante = await repository.update(
    parseId(req.params.id),
    studentData(req.body)
  );
  res.json(estudiante);
}

async function remove(req, res) {
  await repository.remove(parseId(req.params.id));
  res.status(204).end();
}

module.exports = { list, getById, create, replace, update, remove };