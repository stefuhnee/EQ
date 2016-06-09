'use strict';

const Manager = require('../model/manager');
const Session = require('../model/session');
const User = require('../model/user');

module.exports = function(req, res, next) {

  let userId = req.headers.username;

  if (!userId) return next(new Error('Please enter a username in the headers'));

  Manager.findOne({username: userId}, (err, manager) => {

    if (err) return next(err);

    else if (!manager) {
      User.findOne({username: userId}, (err, user) => {
        if (err) {
          return next(err);
        }
        res.user = user;
      });

      Session.findOne({users: userId}, (err, session) => {
        if (err) return next(err);
        res.session = session;

        Manager.findOne({username: session.managerId}, (err, manager) => {
          if (err) {
            return next(err);
          }
          res.manager = manager;
          return next();
        });
      });
    } else {
      res.manager = manager;

      Session.findOne({managerId: userId}, (err, session) => {
        if (err) return next(err);
        res.session = session;
        next();
      });
    }
  });

};
