const mongoose = require('mongoose');
const Joi = require('joi');

const trainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (value) => Joi.string().required().validate(value).error === null,
      message: 'Name is required',
    },
  },
  start_station: {
    type: String,
    required: true,
    validate: {
      validator: (value) => Joi.string().required().validate(value).error === null,
      message: 'Start station is required',
    },
  },
  end_station: {
    type: String,
    required: true,
    validate: {
      validator: (value) => Joi.string().required().validate(value).error === null,
      message: 'End station is required',
    },
  },
  time_of_departure: {
    type: Date,
    required: true,
    validate: {
      validator: (value) => Joi.date().required().validate(value).error === null,
      message: 'Time of departure is required',
    },
  },
});

const Train = mongoose.model('Train', trainSchema);

module.exports = Train;
