'use strict';

const User = require('../model/user');
const Manager = require('../model/manager');

module.exports = function(req, res, next) {

  if(res.user === undefined) {
    console.log('got through the veto refresh manager');
    Manager.findOne({username: res.manager.username}, (err, manager) => {
      if (err) return next(new Error('Cannot find manager.'));
      if(res.manager.signInTime + 3600000 >= Date.now()) {
        Manager.findOneAndUpdate({username: manager.username}, {$set: {vetoes: 0, signInTime: Date.now()}}, (err) => {
          if (err) return next(new Error('Cannot update user vetoes'));
          next();
        });
      }
      next();
    });
  } else {
    console.log('got through the veto refresh user');
    User.findOne({username: res.user.username}, (err, user) => {

      if(res.user.signInTime + 3600000 >= Date.now()) {
        User.findOneAndUpdate({username: user.username}, {$set: {vetoes: 0, signInTime: Date.now()}}, (err) => {
          if (err) return next(new Error('Cannot update user vetoes'));
          next();
        });
      }
      next();
    });
  }
};
