const express = require('express');
const healthController = require('../controllers/healthController');
const estudiantesRoutes = require('./estudiantesRoutes');
const gradosRoutes = require('./gradosRoutes');
const llegadasTardesRoutes = require('./llegadasTardesRoutes');

const router = express.Router();

router.get('/', healthController.check);
router.use('/estudiantes', estudiantesRoutes);
router.use('/grados', gradosRoutes);
router.use('/llegadas-tardes', llegadasTardesRoutes);

module.exports = router;
