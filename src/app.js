const express = require('express');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/error-handler');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Colegio La Pulida S.A.', api: '/api' });
});

app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(errorHandler);

module.exports = app;