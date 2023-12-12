const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  train: { type: Schema.Types.ObjectId, ref: 'Train', required: true },
  is_valid: { type: Boolean, default: false },
  validation_date: { type: Date, default: null, },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
