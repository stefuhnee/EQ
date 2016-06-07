'use strict';

const router = require('express').Router();
const request = require('request');
const User = require('../model/user');
const findUser = require('../lib/find-user');
let access_token;
const checkToken = require('../lib/check-token');

router.use('*', findUser);
router.use('*', checkToken)

router.get('/playlist', (req, res) => {
  // ERROR HANDLING IF NO PLAYLIST
  access_token = req.headers.token;
  request({
    url: `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`
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

router.post('/create/:name', (req, res) => {

  access_token = req.headers.token;
  let user_id = res.user.user_id;
  let playlistName = req.params.name;

  request({
    url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    },
    json: {
      name: playlistName,
      public: false
    }
  }, (err, response, body) => {
    let playlist_id = body.id;
    if (!body.error && res.statusCode === 200) {
      User.findOneAndUpdate({user_id}, { $set: {playlist_id}}, (err) => {
        if (err) console.log('error updating user with playlist');
      });
      return res.json({Message: 'Playlist Created!'});
    }
    else {
      res.json('error', body.error);
    }
  });
});

router.post('/add/:track', (req, res) => {

  access_token = req.headers.token;
  let track = req.params.track;

  request({
    url: `https://api.spotify.com/v1/users/${res.user.user_id}/playlists/${res.user.playlist_id}/tracks`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
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
