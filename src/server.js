require('dotenv').config();

const app = require('./app');
const prisma = require('./config/prisma');

const port = Number(process.env.PORT || 3000);

async function startServer() {
  try {
    await prisma.$connect();
    const server = app.listen(port, () => {
      console.log(`API escuchando en el puerto ${port}`);
    });

    const shutdown = () => {
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('No se pudo iniciar la API:', error.message);
    await prisma.$disconnect();
    process.exitCode = 1;
  }
}

startServer();