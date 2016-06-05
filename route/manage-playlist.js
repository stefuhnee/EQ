'use strict';

const router = require('express').Router();
const request = require('request');
const User = require('../model/user')

router.get('/playlist', (req, res) => {

  let access_token = req.headers.token;
  let playlist_id = req.headers.playlist;
  let user_id = req.headers.user;

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
      res.send(body);
    }
  });
});

router.post('/create/:id', (req, res) => {
  let playlistName = req.headers.name;
  let access_token = req.headers.token;
  let user_id = req.params.id;

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
    console.log(body);
    if (!body.error && res.statusCode === 200) {
      return res.json({Message: 'Playlist Created!'});
    }
    else {
      res.json('error', body.error);
    }
  });
});

module.exports = router;
