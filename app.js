// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const expressJoiValidation = require('express-joi-validation');
const expressJoi = expressJoiValidation.createValidator({ passError: true });
require('dotenv').config();

const User = require('./models/User');
const { authenticateJWT } = require('./middlewares/authenticationMiddleware');
const userRoutes = require('./routes/userRoutes');
const trainRoutes = require('./routes/trainRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const stationRoutes = require('./routes/stationRoutes');

const app = express();
const PORT = 3000;

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { dbName: 'RailRoad' });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  // Force la création de la base de données "RailRoad" s'elle n'existe pas encore
  await mongoose.connection.db.command({ ping: 1 });
  console.log('Database "RailRoad" created or already exists.');
});

// Configuration de Passport avec passport-local-mongoose
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Utilisation des routes avec le préfixe /api
app.use('/', userRoutes, trainRoutes, ticketRoutes, stationRoutes);

// Exemple de route protégée par JWT
app.get('/api/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route.' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
