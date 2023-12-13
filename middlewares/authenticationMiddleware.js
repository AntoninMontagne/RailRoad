const jwt = require('jsonwebtoken');
const { secretKey } = require('../config.js');

// Middleware d'authentification pour vérifier les tokens JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

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
