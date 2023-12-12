const mongoose = require('mongoose');
const Joi = require('joi');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (value) => Joi.string().required().validate(value).error === null,
      message: 'Name is required',
    },
  },
  open_hour: {
    type: String, // ou un autre type selon le format de vos heures
    required: true,
    validate: {
      validator: (value) => Joi.string().required().validate(value).error === null,
      message: 'Open hour is required',
    },
  },
  close_hour: {
    type: String, // ou un autre type selon le format de vos heures
    required: true,
    validate: {
      validator: (value) => Joi.string().required().validate(value).error === null,
      message: 'Close hour is required',
    },
  },
  image: {
    type: String, // chemin d'accès ou URL de l'image
  },
});

const Station = mongoose.model('Station', stationSchema);

module.exports = Station;
