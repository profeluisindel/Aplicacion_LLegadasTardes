const prisma = require('../config/prisma');

module.exports = {
  findAll: () => prisma.estudiante.findMany({ orderBy: { idEstudiante: 'asc' } }),
  findById: (id) => prisma.estudiante.findUnique({ where: { idEstudiante: id } }),
  create: (data) => prisma.estudiante.create({ data }),
  update: (id, data) => prisma.estudiante.update({ where: { idEstudiante: id }, data }),
  delete: (id) => prisma.estudiante.delete({ where: { idEstudiante: id } })
};
