const mongoose = require('mongoose');
const { Schema } = mongoose;

const stationSchema = new Schema({
  name: { type: String, required: true },
  open_hour: { type: Number, required: true },
  close_hour: { type: Number, required: true },
  image: { type: String }, // Assuming you'll store the image URL
});

const Station = mongoose.model('Station', stationSchema);

module.exports = Station;
