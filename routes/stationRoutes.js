const express = require('express');
const router = express.Router();
const stationController = require('../controllers/stationController');

router.post('/register', stationController.register);
router.post('/login', stationController.login);
router.get('/:id', stationController.getStationById);
router.put('/:id', stationController.updateStation);
router.delete('/:id', stationController.deleteStation);

module.exports = router;
