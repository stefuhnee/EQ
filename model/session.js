'use strict';

const mongoose = require('mongoose');

const Session = new mongoose.Schema({
  managerId: {type: mongoose.Schema.Types.ObjectID, required: true, ref: 'manager'},
  playlistId: {type: String},
  users: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
});

module.exports = mongoose.model('session', Session);
