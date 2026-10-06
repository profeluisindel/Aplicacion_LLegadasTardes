const prisma = require('../config/prisma');

function findAll() {
  return prisma.grado.findMany({ orderBy: { idGrado: 'asc' } });
}

function findById(idGrado) {
  return prisma.grado.findUnique({ where: { idGrado } });
}

function create(data) {
  return prisma.grado.create({ data });
}

function update(idGrado, data) {
  return prisma.grado.update({ where: { idGrado }, data });
}

function remove(idGrado) {
  return prisma.grado.delete({ where: { idGrado } });
}

module.exports = { findAll, findById, create, update, remove };