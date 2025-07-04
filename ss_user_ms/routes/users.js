// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Crear o actualizar usuario
router.post('/', async (req, res) => {
  const { sub, name, email, picture, email_verified, role } = req.body;

  if (!sub || !role || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { auth0Id: sub },
      { name, email, picture, email_verified, role },
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create/update user' });
  }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    //res.json({ message: "User microservice is running" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Obtener usuario por Auth0 ID
router.get('/:auth0Id', async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.params.auth0Id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Actualizar rol
router.put('/:auth0Id', async (req, res) => {
  const { role } = req.body;
  const validRoles = ['Estudiante', 'Administrativo', 'Empresa'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { auth0Id: req.params.auth0Id },
      { role },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// Eliminar usuario por Auth0 ID
router.delete('/:auth0Id', async (req,res) => {
  try{
    const deletedUser = await User.findOneAndDelete({auth0Id: req.params.auth0Id});
    if (!deletedUser){
      return res.status(404).json({ error: 'User not found'});
    }
    return res.status(200).json({ message: 'User deleted Succesfully' });
  } catch(err){
    console.error('Error deleting user: ', err);
    return res.status(500).json({ error: 'Failed to delete the user' });
  }
});

module.exports = router;
