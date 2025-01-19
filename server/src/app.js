const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const uri = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' })); // Increase payload size limit

console.log(uri);

connectDB(uri);

// Routes
const apiRoutes = require('./routes/api');
app.use('/', apiRoutes);

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
