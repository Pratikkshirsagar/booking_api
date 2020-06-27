const Rental = require('../models/rental');

exports.getRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.find({});

    res.json({ status: 'success', count: rentals.length, data: rentals });
  } catch (err) {
    res.status(422).json({ status: 'fail', err });
  }
};

exports.getRental = async (req, res, next) => {
  try {
    const { rentalId } = req.params;
    const rental = await Rental.findById(rentalId);

    if (!rental) {
      return Rental.sendError(res, {
        status: 422,
        detail: 'cannot find rental data',
      });
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

exports.updateRentals = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!rental) {
      return Rental.sendError(res, {
        status: 422,
        detail: 'cannot find rental data',
      });
    }

    res.json({ status: 'success', data: rental });
  } catch (err) {
    res.json({ status: 'fail', err });
  }
};

exports.deleteRentals = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findByIdAndDelete(id);

    if (!rental) {
      return Rental.sendError(res, {
        status: 422,
        detail: 'cannot find rental data',
      });
    }

    res.json({ status: 'success', data: {} });
  } catch (err) {
    res.json({ status: 'fail', err });
  }
};
