'use strict';

const mongoose = require('mongoose');

function User = new mongoose.Schema({
  user_id = {type: String, required: true}
});

module.exports = mongoose.model('user', User);
