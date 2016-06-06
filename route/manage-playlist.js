'use strict';

const router = require('express').Router();
const request = require('request');
const User = require('../model/user');
const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET;
let user_id;
let playlist_id;
let access_token;


function checkToken(req, res, next) {
  let time = Date.now();

  User.find({user_id}, (err, user) => {
    console.log('user', user);
    let newToken;
    let newRefresh;
    if (user.tokenExpires > time) {

      let refresh_token = user.refreshToken;
      let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
          grant_type: 'refresh_token',
          refresh_token: refresh_token
        },
        json: true
      };

      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          newToken = body.access_token;
          if (body.refresh_token) {
            newRefresh = body.refresh_token;
            User.findOneAndUpdate({user_id}, {refreshToken: newRefresh, accessToken: newToken});
            return next();
          }
          else {
            User.findOneAndUpdate({user_id}, {refreshToken: null, accessToken: newToken});
            return next();
          }
        }
        else {
          res.send('error refreshing token');
        }
      });
    }
  });
}

router.get('/playlist', checkToken, (req, res) => {
  // ERROR HANDLING IF NO PLAYLIST
  request({
    url: `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}`,
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token
    }
  }, (error, response, body) => {
    if (error) {
      console.log(error);
    } else {
      console.log(response.statusCode, body);
      res.json({message: 'Here is a playlist', data:body});
    }
  });
});

router.post('/create/:id', (req, res) => {

  let playlistName = req.headers.name;
  access_token = req.headers.token;
  user_id = req.params.id;

  request({
    url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json'
    },
    json: {
      name: playlistName,
      public: false
    }
  }, (err, response, body) => {
    playlist_id = body.id;
    if (!body.error && res.statusCode === 200) {
      return res.json({Message: 'Playlist Created!'});
    }
    else {
      res.json('error', body.error);
    }
  });
});

router.post('/add/:track', checkToken, (req, res) => {

  let track = req.params.track;

  request({
    url: `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`,
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json'
    },
    json: {
      uris: [`${track}`]
    }
  }, (err, response, body) => {
    console.log(body);
    if (!body.error && res.statusCode === 200) {
      return res.json({Message: 'Track added!'});
    }
    else {
      res.json('error', body.error);
    }
  });
});

module.exports = router;
