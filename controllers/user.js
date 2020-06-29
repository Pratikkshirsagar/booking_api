const User = require('../models/user');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      return res.status(422).send({
        errors: [
          { title: 'Missing Data!', detail: 'Email or passsword missing' },
        ],
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(422).json({
        title: 'Invalid email',
        detail: `User with provided email doesn't exist`,
      });
    }

    const isMatch = await user.hasSamePassword(password);

    if (!isMatch) {
      res.status(401).json({
        detail: 'Invalid credentials',
      });
    }

    res.json({ token: 'token' });
  } catch (err) {
    res.json({ status: false });
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirmation } = req.body;

    if (!password || !email) {
      return res.status(422).send({
        errors: [
          { title: 'Missing Data!', detail: 'Email or passsword missing' },
        ],
      });
    }

    if (password !== passwordConfirmation) {
      return res.status(422).send({
        errors: [
          {
            title: 'Invalid password',
            detail: 'Password is not matching confirmation password',
          },
        ],
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(422).json({
        title: 'Invalid Email',
        details: 'use with provided email already exist',
      });
    }

    const user = await User.create({ name, email, password });

    res.json({ status: true, detail: 'user register' });
  } catch (err) {
    console.log(err);
    res.json({ status: false });
  }
};
