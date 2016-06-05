'use strict';

const router = require('express').Router();
const request = require('request');
const passport = require('passport');
const SpotifyStrategy = require('../node_modules/passport-spotify/lib/passport-spotify/index').Strategy;
const User = require('../model/user')


// passport.use(new SpotifyStrategy({
//   clientID: process.env.CLIENT_ID = '338fd814034c4c84a756175c3cc3575e',
//   clientSecret: process.env.CLIENT_SECRET = '7cc52791d5e5460abd51f2513873225a',
//   callbackURL: 'http://localhost:8888/callback'
// },
// function(accessToken, refreshToken, profile, done) {
//   console.log(accessToken);
//   User.findOrCreate({ spotifyId: profile.id }, function (err, user) {
//     return done(err, user);
//   });
// }
// ));
//
// router.get('/auth/spotify',
//   passport.authenticate('spotify'),
//   function(req, res){
//     console.log('it got here spotify');
//     // The request will be redirected to spotify for authentication, so this
//     // function will not be called.
//   });
//
// router.get('/callback',
//   passport.authenticate('spotify', { failureRedirect: '/login' }),
//   function(req, res) {
//     console.log('it got here callback');
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

router.get('/getPlaylist', (req, res) => {

  let access_token = req.headers.token;
  let playlist_id = req.headers.playlist;
  let user_id = req.headers.user;

  request({
    url: `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}`,
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token
    }
  }, function(error, response, body){
    if(error) {
      console.log(error);
    } else {
      console.log(response.statusCode, body);
      res.send(body);
    }
  });

});

module.exports = router;
