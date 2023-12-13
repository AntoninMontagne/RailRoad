// controllers/ticketController.js
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Train = require('../models/Train');

const bookTicket = async (req, res) => {
  try {
    const { user, train } = req.body;
    const userObject = await User.findById(user);
    const trainObject = await Train.findById(train);

    // Création d'un nouveau ticket
    const newTicket = new Ticket({
      user: userObject,
      train: trainObject,
      is_valid: false, // Par défaut, le ticket n'est pas valide
    });

    await newTicket.save();

    res.status(201).json(newTicket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const validateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Vérification si le ticket existe
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Vérification si l'utilisateur connecté peut valider ce ticket
    if (req.user.role !== 'admin' && String(ticket.user) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Validation du ticket
    ticket.is_valid = true;
    await ticket.save();

    res.json({ message: 'Ticket validated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  bookTicket,
  validateTicket,
};
``
