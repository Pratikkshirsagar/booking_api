const mongoose = require('mongoose');
const rentalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: [128, 'Invalid length! Maximum is 128 characters'],
  },
  city: {
    type: String,
    required: true,
    lowercase: true,
  },
  street: {
    type: String,
    required: true,
    minlength: [4, 'Invalid length! Minimum length is 4 characters'],
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  numOfRooms: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dailyPrice: {
    type: String,
    required: true,
  },
  shared: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

rentalSchema.statics.sendError = function (res, config) {
  const { status, detail } = config;
  return res
    .status(status)
    .send({ error: [{ title: 'Rental Error', detail }] });
};

module.exports = mongoose.model('Rental', rentalSchema);
