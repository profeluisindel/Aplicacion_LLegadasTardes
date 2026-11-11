const createCrudController = require('./createCrudController');
const repository = require('../repositories/llegadasTardesRepository');
const { parseDate, parseId, parseText, parseTime } = require('./validation');

module.exports = createCrudController({
  repository,
  idField: 'idLlegadaTarde',
  idLabel: 'idLlegadaTarde',
  fields: {
    idEstudiante: (value) => parseId(value, 'idEstudiante'),
    idGrado: (value) => parseId(value, 'idGrado'),
    horaLlegada: parseTime,
    fecha: parseDate,
    detalle: (value) => parseText(value, 'detalle')
  }
});
