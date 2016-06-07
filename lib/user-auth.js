'use strict';

/**
 * This is an example of a basic node.js script that performs
 * the Client Credentials oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */

const request = require('request'); // "Request" library

const client_id = 'CLIENT_ID'; // Your client id
const client_secret = 'CLIENT_SECRET'; // Your secret
const user_id = 'USER_ID';

// your application requests authorization
const authOpts = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOpts, (err, res, body) => {
  console.log('posting');
  console.log(body)
  if (!err && res.statusCode === 200) {


    // use the access token to access the Spotify Web API
    // let token = body.access_token;
    // let options = {
    //   url: `https://api.spotify.com/v1/users/${user_id}`,
    //   headers: {
    //     'Authorization': 'Bearer ' + token
    //   },
    //   json: true
    // };
    // request.get(options, function(error, response, body) {
    //   console.log(body);
    // });
  }
});
