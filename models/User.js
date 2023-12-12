const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (value) => Joi.string().email().validate(value).error === null,
      message: 'Invalid email format',
    },
  },
  pseudo: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (value) => Joi.string().required().validate(value).error === null,
      message: 'Pseudo is required',
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value) => Joi.string().required().validate(value).error === null,
      message: 'Password is required',
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const User = mongoose.model('User', userSchema);

module.exports = User;
