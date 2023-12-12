const Train = require('../models/Train');

const getTrains = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const trains = await Train.find().limit(limit);
    res.json(trains);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTrainById = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) {
      return res.status(404).json({ error: 'Train not found' });
    }
    res.json(train);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createTrain = async (req, res) => {
  try {
    const { name, start_station, end_station, time_of_departure } = req.body;

    // Create a new train
    const train = new Train({ name, start_station, end_station, time_of_departure });
    await train.save();

    res.status(201).json({ message: 'Train created successfully', train });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateTrain = async (req, res) => {
  try {
    const trainId = req.params.id;
    const { name, start_station, end_station, time_of_departure } = req.body;

    // Check if the train exists
    const existingTrain = await Train.findById(trainId);
    if (!existingTrain) {
      return res.status(404).json({ error: 'Train not found' });
    }

    // Update train information
    existingTrain.name = name || existingTrain.name;
    existingTrain.start_station = start_station || existingTrain.start_station;
    existingTrain.end_station = end_station || existingTrain.end_station;
    existingTrain.time_of_departure = time_of_departure || existingTrain.time_of_departure;

    // Save the changes to the database
    await existingTrain.save();

    res.json({ message: 'Train updated successfully', updatedTrain: existingTrain });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteTrain = async (req, res) => {
  try {
    const trainId = req.params.id;

    // Check if the train exists
    const existingTrain = await Train.findById(trainId);
    if (!existingTrain) {
      return res.status(404).json({ error: 'Train not found' });
    }

    // Delete the train from the database
    await existingTrain.remove();

    res.json({ message: 'Train deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getTrains, getTrainById, createTrain, updateTrain, deleteTrain };
