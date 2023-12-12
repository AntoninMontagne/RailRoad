// middleware/validationMiddleware.js
const expressJoi = require('express-joi-validation');
const Joi = expressJoi.Joi;

// Middleware de validation pour les données d'entrée
const validator = expressJoi.validate({
  body: {
    email: Joi.string().email().required(),
    pseudo: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('user', 'admin'),
  },
});

module.exports = {
  validator,
};
