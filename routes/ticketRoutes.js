// routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticateJWT } = require('../middlewares/authenticationMiddleware');

// Route pour réserver un nouveau ticket (protégée par JWT)
router.post('/tickets', authenticateJWT, ticketController.bookTicket);

// Route pour valider un ticket (protégée par JWT et réservée aux employés ou administrateurs)
router.put('/tickets/:ticketId/validate', authenticateJWT, ticketController.validateTicket);

module.exports = router;
