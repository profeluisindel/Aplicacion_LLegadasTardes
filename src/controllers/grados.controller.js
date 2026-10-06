const repository = require('../repositories/grados.repository');
const {
  parseId,
  validatePayload,
  validateStrings,
} = require('../utils/validation');

const fields = ['nombreGrado'];
const maxLengths = { nombreGrado: 100 };

function gradeData(body, requiredFields = []) {
  validatePayload(body, fields, requiredFields);
  return validateStrings(body, fields, maxLengths);
}

async function list(req, res) {
  res.json(await repository.findAll());
}

async function getById(req, res) {
  const grado = await repository.findById(parseId(req.params.id));
  if (!grado) return res.status(404).json({ error: 'Grado no encontrado' });
  res.json(grado);
}

async function create(req, res) {
  const grado = await repository.create(gradeData(req.body, fields));
  res.status(201).location(`/api/grados/${grado.idGrado}`).json(grado);
}

async function replace(req, res) {
  const grado = await repository.update(parseId(req.params.id), gradeData(req.body, fields));
  res.json(grado);
}

async function update(req, res) {
  const grado = await repository.update(parseId(req.params.id), gradeData(req.body));
  res.json(grado);
}

async function remove(req, res) {
  await repository.remove(parseId(req.params.id));
  res.status(204).end();
}

module.exports = { list, getById, create, replace, update, remove };