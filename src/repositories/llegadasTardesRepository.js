const prisma = require('../config/prisma');

const relations = { estudiante: true, grado: true };

module.exports = {
  findAll: () => prisma.llegadaTarde.findMany({ include: relations, orderBy: { idLlegadaTarde: 'asc' } }),
  findById: (id) => prisma.llegadaTarde.findUnique({ where: { idLlegadaTarde: id }, include: relations }),
  create: (data) => prisma.llegadaTarde.create({ data, include: relations }),
  update: (id, data) => prisma.llegadaTarde.update({ where: { idLlegadaTarde: id }, data, include: relations }),
  delete: (id) => prisma.llegadaTarde.delete({ where: { idLlegadaTarde: id } })
};
