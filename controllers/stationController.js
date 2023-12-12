// controllers/stationController.js
const Station = require('../models/Station');

const getStations = async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getStationById = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }
    res.json(station);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createStation = async (req, res) => {
  try {
    const { name, open_hour, close_hour, image } = req.body;

    // Create a new station
    const station = new Station({ name, open_hour, close_hour, image });
    await station.save();

    res.status(201).json({ message: 'Station created successfully', station });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateStation = async (req, res) => {
  try {
    const stationId = req.params.id;
    const { name, open_hour, close_hour, image } = req.body;

    // Check if the station exists
    const existingStation = await Station.findById(stationId);
    if (!existingStation) {
      return res.status(404).json({ error: 'Station not found' });
    }

    // Update station information
    existingStation.name = name || existingStation.name;
    existingStation.open_hour = open_hour || existingStation.open_hour;
    existingStation.close_hour = close_hour || existingStation.close_hour;
    existingStation.image = image || existingStation.image;

    // Save the changes to the database
    await existingStation.save();

    res.json({ message: 'Station updated successfully', updatedStation: existingStation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteStation = async (req, res) => {
  try {
    const stationId = req.params.id;

    // Check if the station exists
    const existingStation = await Station.findById(stationId);
    if (!existingStation) {
      return res.status(404).json({ error: 'Station not found' });
    }

    // Delete the station from the database
    await existingStation.remove();

    res.json({ message: 'Station deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getStations, getStationById, createStation, updateStation, deleteStation };
