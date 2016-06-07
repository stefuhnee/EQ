'use strict';

const mongoose = require('mongoose');

const Session = new mongoose.Schema({
  manager_id: {type: String, required: true},
  playlist_id: {type: String},
  users: {type: Array}
});

module.exports = mongoose.model('session', Session);
