const Rental = require('../models/rental');

exports.getRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.find({});

    res.json({ status: 'success', data: rentals });
  } catch (err) {
    res.status(422).json({ status: 'fail', err });
  }
};

exports.getRental = async (req, res, next) => {
  try {
    const { rentalId } = req.params;
    const rental = await Rental.findById(rentalId);

    if (!rental) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'No resource found' });
    }

    res.json({ status: 'success', data: rental });
  } catch (err) {
    res.status(422).json({ status: 'fail', err });
  }
};
exports.createRental = async (req, res, next) => {
  try {
    const rental = await Rental.create(req.body);

    res.status(201).json(rental);
  } catch (err) {
    res.json({ status: 'fail', err });
  }
};

exports.updateRentals = (req, res, next) => {
  res.status(200).json({ status: 'success', data: 'Data' });
};

exports.deleteRentals = (req, res, next) => {
  res.status(200).json({ status: 'success', data: 'Data' });
};
