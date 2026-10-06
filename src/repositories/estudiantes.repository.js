const prisma = require('../config/prisma');

function findAll() {
  return prisma.estudiante.findMany({ orderBy: { idEstudiente: 'asc' } });
}

function findById(idEstudiente) {
  return prisma.estudiante.findUnique({ where: { idEstudiente } });
}

function create(data) {
  return prisma.estudiante.create({ data });
}

function update(idEstudiente, data) {
  return prisma.estudiante.update({ where: { idEstudiente }, data });
}

function remove(idEstudiente) {
  return prisma.estudiante.delete({ where: { idEstudiente } });
}

module.exports = { findAll, findById, create, update, remove };