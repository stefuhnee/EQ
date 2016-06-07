'use strict';

const mongoose = require('mongoose');

const User = new mongoose.Schema({
  user_id: {type: String, required: true},
  playlist_id: String
});

module.exports = mongoose.model('user', User);
