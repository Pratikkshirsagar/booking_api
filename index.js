const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const rentalRoutes = require('./routes/rentals');

// loading env vars
dotenv.config({ path: './config/config.env' });

// db connection
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  () => {
    console.log('Connected to db');
  }
);

const app = express();

// middleware
app.use(morgan('dev'));

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/rentals', rentalRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server is listening on port: ${PORT}`);
});
