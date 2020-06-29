const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: [32, 'Maximum length should be less than 32'],
    minlength: [4, 'minimum length should be 4 more than 4'],
  },
  email: {
    type: String,
    maxlength: [32, 'Maximum length should be less than 32'],
    minlength: [4, 'minimum length should be 4 more than 4'],
    required: [true, 'Email is required!'],
    lowercase: true,
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ],
  },
  password: {
    type: String,
    minlength: [4, 'Invalid length! Minimum is 4 characters'],
    maxlength: [32, 'Invalid length! Maximum is 32 characters'],
    required: 'Password is required!',
  },
});

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.hasSamePassword = async function (providedPassword) {
  return await bcrypt.compare(providedPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
