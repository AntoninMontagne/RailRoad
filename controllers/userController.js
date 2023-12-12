const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

const register = async (req, res) => {
  try {
    const { email, pseudo, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, pseudo, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, config.secretKey);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const { email, pseudo, password } = req.body;
  
      // Vérifier si l'utilisateur existe
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Mettre à jour les informations de l'utilisateur
      existingUser.email = email || existingUser.email;
      existingUser.pseudo = pseudo || existingUser.pseudo;
  
      // Si un nouveau mot de passe est fourni, le hasher et le sauvegarder
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
      }
  
      // Sauvegarder les modifications dans la base de données
      await existingUser.save();
  
      res.json({ message: 'User updated successfully', updatedUser: existingUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Vérifier si l'utilisateur existe
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Supprimer l'utilisateur de la base de données
      await existingUser.remove();
  
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

module.exports = { register, login, getUserById, updateUser, deleteUser };
