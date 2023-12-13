// controllers/userController.js
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config.js");
const User = require("../models/User");
const passport = require("passport");

const createUser = async (req, res) => {
  try {
    const { email, pseudo, password, role } = req.body;
    const newUser = new User({ email, pseudo, role });
    await User.register(newUser, password);

    // Génération du token JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      secretKey,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserInfo = async (req, res) => {
  // Un utilisateur normal ne peut voir que ses propres informations
  if (req.user.role === "user" && req.params.userId !== req.user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    // Utilisation de async/await avec findById pour obtenir les informations de l'utilisateur
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userInfo = {
      id: user._id,
      email: user.email,
      pseudo: user.pseudo,
      role: user.role,
    };

    res.json(userInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  // Un utilisateur normal ne peut mettre à jour que ses propres informations
  if (
    (req.user.role === "user" || req.user.role === "employee") &&
    req.params.userId !== req.user.id
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const { email, pseudo, password, role } = req.body;

    // Utilisation de async/await avec findById pour obtenir l'utilisateur à mettre à jour
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Mettre à jour les informations de l'utilisateur
    user.email = email;
    user.pseudo = pseudo;
    user.role = role;

    // Si un nouveau mot de passe est fourni, le mettre à jour
    if (password) {
      await user.setPassword(password);
    }

    await user.save();

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUser = (req, res) => {
  // Un utilisateur normal ne peut supprimer que lui-même
  if (
    (req.user.role === "user" || req.user.role === "employee") &&
    req.params.userId !== req.user.id
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }

  User.findOneAndDelete({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.authenticate(req.body.password, (err, authenticated) => {
      if (err || !authenticated) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        secretKey,
        { expiresIn: "1h" }
      );

      res.status(200).json({ token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createUser,
  getUserInfo,
  updateUser,
  deleteUser,
  login,
};
