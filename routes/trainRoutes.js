const express = require('express');
const router = express.Router();
const trainController = require('../controllers/trainController');

router.post('/register', trainController.register);
router.post('/login', trainController.login);
router.get('/:id', trainController.getTrainById);
router.put('/:id', trainController.updateTrain);
router.delete('/:id', trainController.deleteTrain);

module.exports = router;
