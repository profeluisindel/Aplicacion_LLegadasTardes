const HttpError = require('./httpError');
const { parseId, parseBody } = require('./validation');

function createCrudController({ repository, idField, fields, idLabel }) {
  const requiredFields = Object.keys(fields);

  return {
    async getAll(_req, res) {
      const records = await repository.findAll();
      res.status(200).json({ data: records });
    },

    async getById(req, res) {
      const id = parseId(req.params.id, idLabel);
      const record = await repository.findById(id);
      if (!record) throw new HttpError(404, 'NOT_FOUND', 'No se encontró el registro solicitado.');
      res.status(200).json({ data: record });
    },

    async create(req, res) {
      const data = parseBody(req.body, fields, requiredFields);
      const record = await repository.create(data);
      res.status(201).json({ data: record });
    },

    async replace(req, res) {
      const id = parseId(req.params.id, idLabel);
      const data = parseBody(req.body, fields, requiredFields);
      const record = await repository.update(id, data);
      res.status(200).json({ data: record });
    },

    async patch(req, res) {
      const id = parseId(req.params.id, idLabel);
      const data = parseBody(req.body, fields, []);
      const record = await repository.update(id, data);
      res.status(200).json({ data: record });
    },

    async remove(req, res) {
      const id = parseId(req.params.id, idLabel);
      await repository.delete(id);
      res.status(204).end();
    }
  };
}

module.exports = createCrudController;
