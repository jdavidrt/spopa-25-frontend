// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 4010;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI)/*, {
  //useNewUrlParser: true,
  useUnifiedTopology: true
})*/
.then(() => {
  console.log('Conectado a mongo');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => console.error('Connection error', err));
