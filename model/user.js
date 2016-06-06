'use strict';

const mongoose = require('mongoose');

const User = new mongoose.Schema({
  user_id: {type: String, required: true},
  accessToken: {type: String, required: true},
  refreshToken: {type: String, required: true},
  tokenExpires: {type: Number, required: true}
});

module.exports = mongoose.model('user', User);
