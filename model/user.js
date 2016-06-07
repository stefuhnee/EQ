'use strict';

const mongoose = require('mongoose');

const User = new mongoose.Schema({
  user_id: {type: String, required: true},
  votes: {type: Number, required: true, default: 0},
  tracks: {type: Array}
});

module.exports = mongoose.model('user', User);
