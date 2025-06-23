const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/users', require('./routes/users'));
app.use('/internships', require('./routes/internships'));

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
