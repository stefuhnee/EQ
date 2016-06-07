'use strict';

const router = require('express').Router();
const request = require('request');
const User = require('../model/user');
const findUser = require('../lib/find-user');
const checkToken = require('../lib/check-token');
const requestAgent = require('superagent');
let access_token;

router.use('*', findUser);
router.use('*', checkToken);

router.get('/playlist', (req, res) => {

  let playlist_id = req.headers.name;
  let user_id = req.headers.id;
  access_token = req.headers.token;
  let pTracks;
  request
  .get(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}`)
  .set('Authorization', `Bearer ${access_token}`)
  .end((err, res) => {
    console.log(res.body.tracks.items[0]);
    if (err) return err;
    pTracks = res.body.tracks.items;
  });
  res.json({tracks: pTracks});
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

router.delete('/delete/:track', (req, res) => {
  let user = res.user;
  let track = req.params.track;
  let user_id = req.headers.username;
  let playlist_id = user.playlist_id;
  access_token = req.headers.token;
  requestAgent
    .del(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`)
    .send({
      'tracks' : [
        {
          'uri' : `${track}`
        }
      ]
    })
    .set(
      'Authorization', `Bearer ${access_token}`
    )
    .set(
      'Accept', 'application/json'
    )
    .end((err) => {
      if(err) return err;
    });
  res.send('ending');
});

module.exports = router;
