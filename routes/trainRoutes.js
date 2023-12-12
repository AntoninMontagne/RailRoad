// routes/trainRoutes.js
const express = require('express');
const router = express.Router();
const trainController = require('../controllers/trainController');
const { authenticateJWT } = require('../middlewares/authenticationMiddleware');

// Route pour lister les trains
router.get('/trains', trainController.listTrains);

// Route pour créer un nouveau train
router.post('/trains', authenticateJWT, trainController.createTrain);

// Route pour mettre à jour un train
router.put('/trains/:trainId', authenticateJWT, trainController.updateTrain);

// Route pour supprimer un train
router.delete('/trains/:trainId', authenticateJWT, trainController.deleteTrain);

module.exports = router;
