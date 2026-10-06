const prisma = require('../config/prisma');

function findAll() {
  return prisma.llegadaTarde.findMany({
    orderBy: [{ fecha: 'desc' }, { horaLlegadaTardia: 'desc' }],
  });
}

function findById(idLlegadaTarde) {
  return prisma.llegadaTarde.findUnique({ where: { idLlegadaTarde } });
}

function create(data) {
  return prisma.llegadaTarde.create({ data });
}

function update(idLlegadaTarde, data) {
  return prisma.llegadaTarde.update({ where: { idLlegadaTarde }, data });
}

function remove(idLlegadaTarde) {
  return prisma.llegadaTarde.delete({ where: { idLlegadaTarde } });
}

module.exports = { findAll, findById, create, update, remove };