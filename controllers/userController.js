// controllers/userController.js
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config.js');
const User = require('../models/User');

const createUser = async (req, res) => {
  try {
    const { email, pseudo, password, role } = req.body;
    const newUser = new User({ email, pseudo, role });
    await User.register(newUser, password);

    // Génération du token JWT
    const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, secretKey, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserInfo = (req, res) => {
  // Un utilisateur normal ne peut voir que ses propres informations
  if (req.user.role === 'user' && req.params.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Un employé ou un admin peut voir les informations de n'importe quel utilisateur
  User.findById(req.params.userId, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userInfo = {
      id: user._id,
      email: user.email,
      pseudo: user.pseudo,
      role: user.role,
    };

    res.json(userInfo);
  });
};

const updateUser = (req, res) => {
  // Un utilisateur normal ne peut mettre à jour que ses propres informations
  if (req.user.role === 'user' && req.params.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { email, pseudo, password, role } = req.body;

  User.findById(req.params.userId, async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Met à jour les informations de l'utilisateur
    user.email = email;
    user.pseudo = pseudo;
    user.role = role;

    // Si un nouveau mot de passe est fourni, le met à jour
    if (password) {
      await user.setPassword(password);
    }

    await user.save();

    res.json({ message: 'User updated successfully' });
  });
};

const deleteUser = (req, res) => {
  // Un utilisateur normal ne peut supprimer que lui-même
  if (req.user.role === 'user' && req.params.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  User.findByIdAndRemove(req.params.userId, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  });
};

module.exports = {
  createUser,
  getUserInfo,
  updateUser,
  deleteUser,
};
