'use strict';

const User = require('../model/user');

module.exports = function(req, res, next) {
  let user_id = req.headers.username;
  User.findOne({user_id}, (err, user) => {
    if (err) return res.send('Invalid username provided');
    res.user = user;
    next();
  });
};
