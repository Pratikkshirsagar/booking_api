const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      return res.sendAPiError({
        title: 'Missing Data!',
        detail: 'Email or passsword missing',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.sendAPiError({
        title: 'Invalid email',
        detail: `User with provided email doesn't exist`,
      });
    }

    const isMatch = await user.hasSamePassword(password);

    if (!isMatch) {
      return res.sendAPiError({
        title: 'Invalid',
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
    res.mongoError(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirmation } = req.body;

    if (!password || !email) {
      return res.sendAPiError({
        title: 'Missing Data!',
        detail: 'Email or passsword missing',
      });
    }

    if (password !== passwordConfirmation) {
      return res.sendAPiError({
        title: 'Invalid password',
        detail: 'Password is not matching confirmation password',
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.sendAPiError({
        title: 'Invalid Email',
        detail: 'use with provided email already exist',
      });
    }

    const user = await User.create({ name, email, password });

    res.json({ status: true, detail: 'user register' });
  } catch (err) {
    console.log(err);
    res.mongoError(err);
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
    res.mongoError(err);
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
