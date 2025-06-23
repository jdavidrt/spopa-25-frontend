const express = require('express');
const router = express.Router();
const axios = require('axios');

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL;

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${USERS_SERVICE_URL}/`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Error connecting to Users Service' });
  }
});

module.exports = router;
