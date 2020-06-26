const express = require('express');
const router = express.Router();

const {
  getRentals,
  getRental,
  createRental,
  updateRentals,
  deleteRentals,
} = require('../controllers/rentals');

router.route('/').get(getRentals).post(createRental);
router.route('/:id').get(getRental).patch(updateRentals).delete(deleteRentals);

module.exports = router;
