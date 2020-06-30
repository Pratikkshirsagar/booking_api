const express = require('express');
const router = express.Router();

const { createBooking } = require('../controllers/booking');
const { isUserRentalOwner } = require('../controllers/rentals');
const { onlyAuthUser } = require('../controllers/user');

router.post('/', onlyAuthUser, isUserRentalOwner, createBooking);
module.exports = router;
