'use strict';

const jwt = require('jsonwebtoken');
const Session = require('../model/session');
const Manager = require('../model/manager');

module.exports = function(req, res, next) {
  let userId = jwt.decode(req.headers.token)._id;
  console.log(userId);
  Session.findOne({users:ObjectId(userId)}, (err, session) => {
    console.log(session);
    Manager.findOne({username: session.manager_id}, (err, manager) => {
      res.manager = manager;
      next();
    });
  });
};
