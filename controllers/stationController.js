// controllers/stationController.js
const Station = require('../models/Station');
const Train = require('../models/Train');

const listStations = async (req, res) => {
  try {
    const { sortBy } = req.query;
    const query = Station.find();

    if (sortBy) {
      query.sort(sortBy);
    }

    const stations = await query.exec();
    res.json(stations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createStation = async (req, res) => {
  try {
    // Vérification du rôle de l'utilisateur
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { name, open_hour, close_hour } = req.body;
    const newStation = new Station({ name, open_hour, close_hour });

    // Ajoutez la logique pour gérer l'image ici si nécessaire

    await newStation.save();
    res.status(201).json(newStation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateStation = async (req, res) => {
  try {
    // Vérification du rôle de l'utilisateur
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { name, open_hour, close_hour } = req.body;

    const updatedStation = await Station.findByIdAndUpdate(
      req.params.stationId,
      { name, open_hour, close_hour },
      { new: true }
    );

    if (!updatedStation) {
      return res.status(404).json({ error: 'Station not found' });
    }

    // Ajoutez la logique pour gérer l'image ici si nécessaire

    res.json(updatedStation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteStation = async (req, res) => {
  try {
    // Vérification du rôle de l'utilisateur
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const deletedStation = await Station.findByIdAndRemove(req.params.stationId);

    if (!deletedStation) {
      return res.status(404).json({ error: 'Station not found' });
    }

    // Supprimer les trains associés à cette station
    await Train.deleteMany({ $or: [{ start_station: deletedStation._id }, { end_station: deletedStation._id }] });

    res.json({ message: 'Station deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  listStations,
  createStation,
  updateStation,
  deleteStation,
};
