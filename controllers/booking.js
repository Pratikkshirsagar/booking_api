const Booking = require('../models/booking');

exports.createBooking = async (req, res, next) => {
  try {
    const bookingData = req.body;

    res.status(200).json({ status: 'success', detail: 'Booking confirm' });
  } catch (err) {
    console.log(err);
  }
};
