const express = require('express');
const router = express.Router();

const { createBooking } = require('../controllers/booking');

const { onlyAuthUser } = require('../controllers/user');

router.post('/', onlyAuthUser, createBooking);
module.exports = router;
