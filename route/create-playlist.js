'use strict';

const request = require('request');
const router = require('express').Router();

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
  }, (err) => {
    if (!err && res.statusCode === 200) {
      return res.send('playlist created!');
    }
    else {
      res.send('error', err);
    }
  });
});


module.exports = router;
