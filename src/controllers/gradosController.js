const createCrudController = require('./createCrudController');
const repository = require('../repositories/gradosRepository');
const { parseText } = require('./validation');

module.exports = createCrudController({
  repository,
  idField: 'idGrado',
  idLabel: 'idGrado',
  fields: {
    nombre: (value) => parseText(value, 'nombre')
  }
});
