// controllers/trainController.js
const Train = require('../models/Train');
const Station = require('../models/Station');

const listTrains = async (req, res) => {
  try {
    const { sortBy, limit } = req.query;
    const query = Train.find();

    if (sortBy) {
      query.sort(sortBy);
    }

    if (limit) {
      query.limit(parseInt(limit, 10));
    }

    const trains = await query.exec();
    res.json(trains);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createTrain = async (req, res) => {
  try {
    const { name, start_station, end_station, time_of_departure } = req.body;

    // Vérifier si les stations existent par leur nom
    const startStation = await Station.findOne({ name: start_station });
    const endStation = await Station.findOne({ name: end_station });

    if (!startStation || !endStation) {
      return res.status(404).json({ error: 'Start or end station not found' });
    }

    const newTrain = new Train({
      name,
      start_station: startStation._id,
      end_station: endStation._id,
      time_of_departure,
    });

    await newTrain.save();
    res.status(201).json(newTrain);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const updateTrain = async (req, res) => {
  try {
    const { name, start_station, end_station, time_of_departure } = req.body;

    // Vérifier si les stations existent
    const startStationExists = await Station.exists({ _id: start_station });
    const endStationExists = await Station.exists({ _id: end_station });

    if (!startStationExists || !endStationExists) {
      return res.status(404).json({ error: 'Start or end station not found' });
    }

    const updatedTrain = await Train.findByIdAndUpdate(
      req.params.trainId,
      { name, start_station, end_station, time_of_departure },
      { new: true }
    );

    if (!updatedTrain) {
      return res.status(404).json({ error: 'Train not found' });
    }

    res.json(updatedTrain);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteTrain = async (req, res) => {
  try {
    const deletedTrain = await Train.findOneAndDelete(req.params.trainId);

    if (!deletedTrain) {
      return res.status(404).json({ error: 'Train not found' });
    }

    res.json({ message: 'Train deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  listTrains,
  createTrain,
  updateTrain,
  deleteTrain,
};
