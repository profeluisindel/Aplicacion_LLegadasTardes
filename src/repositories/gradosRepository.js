const prisma = require('../config/prisma');

module.exports = {
  findAll: () => prisma.grado.findMany({ orderBy: { idGrado: 'asc' } }),
  findById: (id) => prisma.grado.findUnique({ where: { idGrado: id } }),
  create: (data) => prisma.grado.create({ data }),
  update: (id, data) => prisma.grado.update({ where: { idGrado: id }, data }),
  delete: (id) => prisma.grado.delete({ where: { idGrado: id } })
};
