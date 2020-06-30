const Booking = require('../models/booking');
const moment = require('moment');

exports.createBooking = async (req, res, next) => {
  try {
    const bookingData = req.body;
    const booking = new Booking({ ...bookingData, user: res.locals.user });

    if (!checkIfBookingDatesAreValid(booking)) {
      return res.status(422).json({ message: 'Booking is not created' });
    }

    const rentalBooking = await Booking.find({ rental: booking.rental });

    const isValid = checkIfBookingIsValid(booking, rentalBooking);

    if (!isValid) {
      return res.status(422).json({ message: 'Booking is not created' });
    }

    const savedBooking = await booking.save();

    res.status(200).json({
      status: 'success',
      detail: 'Booking confirm',
      data: {
        startAt: savedBooking.startAt,
        endAt: savedBooking.endAt,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

function checkIfBookingDatesAreValid(booking) {
  let isValid = true;

  if (!booking.startAt || !booking.endAt) {
    isValid = false;
  }

  if (moment(booking.startAt) > moment(booking.endAt)) {
    isValid = false;
  }

  return isValid;
}

function checkIfBookingIsValid(pendingbooking, rentalBookings) {
  let isValid = true;

  if (rentalBookings && rentalBookings.length > 0) {
    isValid = rentalBookings.every((booking) => {
      const pendingStart = moment(pendingbooking.startAt);
      const pendingEnd = moment(pendingbooking.endAt);

      const bookingStart = moment(booking.startAt);
      const bookingEnd = moment(booking.endAt);

      return (
        (bookingStart < pendingStart && bookingEnd < pendingStart) ||
        (pendingEnd < bookingEnd && pendingEnd < bookingStart)
      );
    });
  }

  return isValid;
}
