// controllers/stationController.js
const Station = require('../models/Station');
const Train = require('../models/Train');
const sharp = require('sharp');
const path = require('path');

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

const getStationInfo = async (req, res) => {
  try {
    // Utilisation de async/await avec findById pour obtenir les informations de la station
    const station = await Station.findById(req.params.stationId);

    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }

    const stationInfo = {
      id: station._id,
      name: station.name,
      open_hour: station.open_hour,
      close_hour: station.close_hour,
      image: station.image ? path.join('/img', station.image) : null,
    };

    res.json(stationInfo);
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

    if (req.body.image) {
      try {
        const imageName = path.basename(req.body.image, path.extname(req.body.image)); // Récupère le nom de base sans l'extension
        const resizedImagePath = path.join(__dirname, '..', 'img', `${imageName}-resized.jpg`);

        await sharp(req.body.image)
          .resize(200, 200)
          .toFile(resizedImagePath);

        newStation.image = `${imageName}-resized.jpg`;
      } catch (imageError) {
        console.error('Error processing image:', imageError);
        return res.status(500).json({ error: 'Error processing image' });
      }
    }

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

    const { name, open_hour, close_hour, image } = req.body;

    // Récupération de la station existante
    const existingStation = await Station.findById(req.params.stationId);

    if (!existingStation) {
      return res.status(404).json({ error: 'Station not found' });
    }

    // Mettez à jour les propriétés de la station
    existingStation.name = name;
    existingStation.open_hour = open_hour;
    existingStation.close_hour = close_hour;

    // Mise à jour de l'image si une nouvelle image est fournie
    if (req.body.image) {
      try {
        const imageName = path.basename(req.body.image, path.extname(req.body.image));
        const resizedImagePath = path.join(__dirname, '..', 'img', `${imageName}-resized.jpg`);

        await sharp(req.body.image)
          .resize(200, 200)
          .toFile(resizedImagePath);

        existingStation.image = `${imageName}-resized.jpg`;
      } catch (imageError) {
        console.error('Error processing image:', imageError);
        return res.status(500).json({ error: 'Error processing image' });
      }
    }

    // Sauvegarde de la station mise à jour
    const updatedStation = await existingStation.save();
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

    const deletedStation = await Station.findOneAndDelete(req.params.stationId);

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
  getStationInfo,
  createStation,
  updateStation,
  deleteStation,
};
