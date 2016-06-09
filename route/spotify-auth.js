'use strict';

const express = require('express');
const router = express.Router();
const request = require('request');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret

const stateKey = 'spotify_auth_state';

const generateRandomString = require('../lib/generate-random-string');

const Manager = require('../model/manager');
const Session = require('../model/session');

let accessToken;
let managerId;
let redirect_uri;

router.use(express.static(__dirname + '/../public'))
   .use(cookieParser());

router.get('/login', (req, res) => {

  let state = generateRandomString(16);
  res.cookie(stateKey, state);
  let scope = 'user-read-private playlist-modify-private';
  redirect_uri = `${req.headers.host === 'localhost:8888'?'http://localhost:8888/callback':'https://eq-project.herokuapp.com/callback'}`;

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

router.get('/callback', (req, res, next) => {

  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);

    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, (error, response, body) => {

      if (!error && response.statusCode === 200) {
        accessToken = body.access_token;
        let expiresIn = body.expires_in * 1000;
        let refreshToken = body.refresh_token;

        let options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + accessToken },
          json: true
        };

        request.get(options, function(error, response, body) {

          managerId = body.id;
          let newManager = new Manager({username: managerId, tokenExpires: expiresIn + Date.now(), accessToken: accessToken, refreshToken: refreshToken});
          let newSession = new Session({managerId: managerId});

          Manager.findOneAndUpdate({username: managerId}, { $set: {accessToken: accessToken, refreshToken: refreshToken}}, (err, manager) => {

            if (err) return next(err);

            else if (!manager) {
              newManager.save((err) => {
                if (err) return next(err);
                newSession.save((err) => {
                  if (err) return next(err);
                  return res.json({Message: 'Successfully authorized'});
                });
              });
            } else {
              res.json({Message: 'You are already authorized, but thanks for trying!'});
            }
          });
        });
      }
    });
  }
});

router.use((err, req, res, next) => {
  res.json(err.message);
  next(err);
});

module.exports = router;
