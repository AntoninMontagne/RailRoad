const Ticket = require('../models/Ticket');

// Fonction pour réserver un billet
const bookTicket = async (req, res) => {
    try {
      const { userId, trainId } = req.body;
  
      // Vérifier si l'utilisateur existe
      const userExists = await User.exists({ _id: userId });
      if (!userExists) {
        return res.status(404).json({ error: 'L\'utilisateur n\'existe pas' });
      }
  
      // Vérifier si le train existe
      const trainExists = await Train.exists({ _id: trainId });
      if (!trainExists) {
        return res.status(404).json({ error: 'Le train n\'existe pas' });
      }
  
      // Créer un nouveau billet
      const ticket = new Ticket({ user: userId, train: trainId });
      await ticket.save();
  
      res.status(201).json({ message: 'Billet réservé avec succès', ticket });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};

// Fonction pour valider un billet
const validateTicket = async (req, res) => {
    try {
      const ticketId = req.params.id;
  
      // Vérifier si le billet existe
      const existingTicket = await Ticket.findById(ticketId);
      if (!existingTicket) {
        return res.status(404).json({ error: 'Billet non trouvé' });
      }
  
      // Vérifier si le billet a déjà été validé
      if (existingTicket.is_valid) {
        return res.status(400).json({ error: 'Ce billet a déjà été validé' });
      }
  
      // Récupérer les informations du train associé au billet
      const associatedTrain = await Train.findById(existingTicket.train);
      if (!associatedTrain) {
        return res.status(404).json({ error: 'Train associé au billet non trouvé' });
      }
  
      // Vérifier si la date de validation est avant la date de départ du train
      const currentDate = new Date();
      if (currentDate > associatedTrain.time_of_departure) {
        return res.status(400).json({ error: 'La date de validation doit être avant la date de départ du train' });
      }
  
      // Mettre à jour le statut et la date de validation du billet
      existingTicket.is_valid = true;
      existingTicket.validation_date = currentDate; // Vous pouvez utiliser la date actuelle ou définir une date spécifique
      await existingTicket.save();
  
      res.json({ message: 'Billet validé avec succès', ticket: existingTicket });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};  

module.exports = { bookTicket, validateTicket };
  