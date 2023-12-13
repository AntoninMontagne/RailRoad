// routes/userRoutes.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middlewares/authenticationMiddleware');

// Route pour créer un nouvel utilisateur avec validation et token JWT
router.post('/users', userController.createUser);

// Route pour obtenir des informations sur un utilisateur (protégée par JWT)
router.get('/users/:userId', authenticateJWT, userController.getUserInfo);

// Route pour mettre à jour un utilisateur (protégée par JWT)
router.put('/users/:userId', authenticateJWT, userController.updateUser);

// Route pour supprimer un utilisateur (protégée par JWT)
router.delete('/users/:userId', authenticateJWT, userController.deleteUser);

// Route pour se login
<<<<<<< HEAD
router.post('/login', userController.login);
=======
router.post('/login', passport.authenticate('local'), userController.login);

// Route protégée par JWT
//router.get('/protected', authenticateJWT, userController.protectedRoute);
>>>>>>> refs/remotes/origin/main

module.exports = router;
