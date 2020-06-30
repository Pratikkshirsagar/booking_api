const mongoose = require('mongoose');
const { schema } = require('./rental');

const bookingSchema = new mongoose.Schema({
  startAt: {
    type: Date,
    required: [true, 'Starting date is required'],
  },
  endAt: {
    type: Date,
    required: [true, 'Ending date is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  nights: {
    type: Number,
    required: [true, 'night is required'],
  },
  guests: {
    type: Number,
    required: [true, 'Guest is required'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  rental: {
    type: mongoose.Schema.ObjectId,
    ref: 'Rental',
    required: [true, 'rental is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
