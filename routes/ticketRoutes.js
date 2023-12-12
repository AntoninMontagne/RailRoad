const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/register', ticketController.register);
router.post('/login', ticketController.login);
router.get('/:id', ticketController.getTicketById);
router.put('/:id', ticketController.updateTicket);
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;
