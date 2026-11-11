require('dotenv').config();

const app = require('./app');
const prisma = require('./config/prisma');

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  await prisma.$connect();
  const server = app.listen(port, () => {
    console.log(`API disponible en http://localhost:${port}`);
  });

  let shuttingDown = false;
  const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`Señal ${signal} recibida; cerrando el servidor.`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer().catch(async (error) => {
  console.error('No fue posible iniciar la API:', error.message);
  await prisma.$disconnect();
  process.exitCode = 1;
});