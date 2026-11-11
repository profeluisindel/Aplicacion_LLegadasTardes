const createCrudController = require('./createCrudController');
const repository = require('../repositories/estudiantesRepository');
const { parseText } = require('./validation');

module.exports = createCrudController({
  repository,
  idField: 'idEstudiante',
  idLabel: 'idEstudiante',
  fields: {
    nie: (value) => parseText(value, 'nie'),
    nombre: (value) => parseText(value, 'nombre'),
    responsable: (value) => parseText(value, 'responsable'),
    telefono: (value) => parseText(value, 'telefono')
  }
});
