const mongoose = require('mongoose');
const Joi = require('joi');

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: (value) => Joi.string().required().validate(value).error === null,
      message: 'User ID is required',
    },
  },
  train: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
    required: true,
    validate: {
      validator: (value) => Joi.string().required().validate(value).error === null,
      message: 'Train ID is required',
    },
  },
  is_valid: {
    type: Boolean,
    default: false,
  },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
