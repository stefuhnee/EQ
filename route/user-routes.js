'use strict';

const express = require('express');
const bodyParser = require('body-parser').json();
const basicAuth = require('../lib/basic-auth');
const User = require('../model/user');
const Session = require('../model/session');
const router = module.exports = express.Router();

router.post('/signup', bodyParser, (req, res, next) => {

  if (!req.body.password || !req.body.username) return next(new Error('Please enter a username and password'));

  let newUser = new User(req.body);
  let managerId = req.headers.manager;
  newUser.password = newUser.hashPassword();
  req.body.password = null;

  User.findOne({username: req.body.username}, (err, user) => {
    if (err || user) return next(new Error('Could not create user'));
    newUser.userToken = newUser.generateToken();

    newUser.save((err, user) => {
      if (managerId) {
        if (err) return next(new Error('Could not create user'));
        findAndUpdateSession(managerId, user, next);
        res.json({token: newUser.userToken});
      } else {
        if (err) return next(new Error('Could not create user'));
        res.json({token: newUser.userToken});
      }
    });
  });
});


router.get('/signin', basicAuth, (req, res, next) => {

<<<<<<< HEAD
  let managerId = req.headers.manager;
=======
  let managerID = req.headers.manager;
>>>>>>> 908e5fb2dd643a023036971c3e3238183891843e
  let username = req.auth.username;
  let password = req.auth.password;

  User.findOne({username}, (err, user) => {
<<<<<<< HEAD
    if (err || !user || !user.comparePassword(password)) return next(new Error('Validation failure'));
    else if (managerId) findAndUpdateSession(managerId, user, next);
=======
    if (err || !user) return next(new Error('Cannot find user'));
    if (!user.comparePassword(req.auth.password)) {
      return next(new Error('Invalid password'));
    }

    findAndUpdateSession(managerID, user, next);
>>>>>>> 908e5fb2dd643a023036971c3e3238183891843e
    return res.json({token: user.generateToken()});
  });
});

<<<<<<< HEAD
function findAndUpdateSession(managerId, user, next) {

  Session.findOne({managerId}, (err, session) => {
    let users = session.users;

    if (err || !session) return next(err);
    else if (users.indexOf(user.username) === -1) {
      users.push(user.username);
      Session.findOneAndUpdate({managerId}, {$set: {users}}, (err) => {
        if (err) return next(err);
=======
function findAndUpdateSession(managerID, user, next) {
  Session.findOne({manager_id: managerID}, (err, session) => {
    if (err || !session) return next(new Error('Cannot find session'));
    else if (session.users.indexOf(user.username) === -1) {
      let sessionArray = session.users;
      sessionArray.push(user.username);
      Session.findOneAndUpdate({manager_id: managerID}, {$set: {users: sessionArray}}, (err) => {
        if (err) return next(new Error('Cannot update session'));
>>>>>>> 908e5fb2dd643a023036971c3e3238183891843e
      });
    }
  });
}

module.exports = router;
