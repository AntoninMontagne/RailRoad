const jwt = require('jsonwebtoken');
const { secretKey } = require('../config.js');

// Middleware d'authentification pour vérifier les tokens JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user;
    return next();
  });
};

module.exports = {
  authenticateJWT,
};
