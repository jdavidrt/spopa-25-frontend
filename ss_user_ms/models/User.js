// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true }, // user.sub
  name: String,
  email: { type: String, required: true },
  picture: String,
  email_verified: Boolean,
  role: {
    type: String,
    enum: ['Estudiante', 'Administrativo', 'Empresa'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
