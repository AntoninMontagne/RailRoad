const mongoose = require('mongoose');
const Joi = require('joi');

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  train: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  is_valid: {
    type: Boolean,
    default: false,
  },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

Ticket.validateTicket = async function(ticketData) {
  const schema = Joi.object({
    user: Joi.string().required(),
    train: Joi.string().required(),
    is_valid: Joi.boolean().default(false),
  });

  return await schema.validateAsync(ticketData);
};

module.exports = Ticket;
