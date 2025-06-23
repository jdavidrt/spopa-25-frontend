const express = require('express');
const router = express.Router();
const axios = require('axios');

const INTERNSHIPS_SERVICE_URL = process.env.INTERNSHIPS_SERVICE_URL;

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${INTERNSHIPS_SERVICE_URL}/`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Error connecting to Internships Service' });
  }
});

module.exports = router;
