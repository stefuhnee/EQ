'use strict';

const router = require('express').Router();
const dumrequest = require('request');
const User = require('../model/user');
const request = require('superagent');
let user_id;
let playlist_id;
let access_token;

// router.get('/playlist', (req, res) => {
//   // ERROR HANDLING IF NO PLAYLIST
//   dumrequest({
//     url: `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}`,
//     method: 'GET',
//     headers: {
//       Authorization: 'Bearer ' + access_token
//     }
//   }, (error, response, body) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log(response.statusCode, body);
//       res.json({message: 'Here is a playlist', data:body});
//     }
//   });
// });

router.get('/playlist', (req, res) => {
  playlist_id = req.headers.name;
  user_id = req.headers.id;
  access_token = req.headers.token;
  let pTracks;
  request
  .get(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}`)
  .set('Authorization', 'Bearer ' + access_token)
  .end((err, res) => {
    console.log(res.body.tracks.items[0]);
    if(err) return err;
    pTracks = res.body.tracks.items;
  })
  res.json({tracks: pTracks});
});

router.post('/create/:id', (req, res) => {

  let playlistName = req.headers.name;
  access_token = req.headers.token;
  user_id = req.params.id;

  dumrequest({
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

router.post('/add/:track', (req, res) => {

  let track = req.params.track;


  dumrequest({
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

router.delete('/delete/:track', (req, res) => {
  let track = req.params.track;
  access_token = req.headers.token;
  user_id = req.headers.id;
  playlist_id = req.headers.playlist;
  request
    .del(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`)
    .send({
      'tracks' : [
        {
          'uri' : `${track}`
        }
      ]
    })
    .set(
      'Authorization', 'Bearer ' + access_token
    )
    .set(
      'Accept', 'application/json'
    )
    .end(function(err, res){
      if(err) return err;
    });
    res.send('ending');
});

module.exports = router;
