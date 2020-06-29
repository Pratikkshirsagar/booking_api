const User = require('../models/user');
const jwt = require('jsonwebtoken');

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

    const token = jwt.sign(
      {
        sub: user.id,
        username: user.name,
      },
      process.env.JET_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
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

exports.onlyAuthUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return notAuthorize(res);
    }

    const decoded = parseToken(token);

    if (!decoded) {
      return notAuthorize(res);
    }

    const user = await User.findById(decoded.sub);

    if (!user) {
      return notAuthorize(res);
    }

    res.locals.user = user;

    next();
  } catch (err) {
    console.log(err);
    return res
      .status(422)
      .json({ status: false, msg: 'Ooooops something went wrong' });
  }
};

function parseToken(token) {
  try {
    return jwt.verify(token.split(' ')[1], process.env.JET_SECRET);
  } catch (error) {
    return null;
  }
}

function notAuthorize(res) {
  return res.status(401).json({
    status: false,
    detail: 'Not Authorizer user',
    msg: 'You need to login to get access',
  });
}
