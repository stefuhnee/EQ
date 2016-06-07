'use strict';

const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET;
const request = require('request');
const User = require('../model/user');
let user_id;

module.exports = function(req, res, next) {
  
  let time = Date.now();
  let user = res.user;
  user_id = user.user_id;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: user.refresh_token
    },
    json: true
  };

  if (user.tokenExpires > time) {
    request.post(authOptions, getNewToken);
  }
  next();
};


function getNewToken(err, res, body) {
  console.log('POSTING TO SPOTIFY');

  if (!err && res.statusCode === 200) {
    console.log('successfully requested a new token from spotify');
    User.findOneAndUpdate({user_id}, { $set: {accessToken: res.user.access_token, refreshToken: null}}, (err) => {
      if (err) console.log(err);
    });
    console.log('response from spotify', body);
  }
}
