const express = require('express');
const estudiantesRoutes = require('./estudiantes.routes');
const gradosRoutes = require('./grados.routes');
const llegadasTardesRoutes = require('./llegadas-tardes.routes');

const router = express.Router();

router.use('/estudiantes', estudiantesRoutes);
router.use('/grados', gradosRoutes);
router.use('/llegadas-tardes', llegadasTardesRoutes);

module.exports = router;