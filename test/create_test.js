'use strict';
const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;


 let client_id = process.env.CLIENT_ID;
 let client_secret = process.env.CLIENT_SECRET;
 let access_token = process.env.TOKEN;
//const redirect_uri = 'http://localhost:8888/callback'
const createPL = require('../route/manage-playlist.js');
const userAuth = require('../route/user-auth.js');
//const httpRequest = require('request');

// const mongoose = require('mongoose');
// const dbPort = process.env.MONGOLAB_URI;
// process.env.MONGOLAB_URI = 'mongodb://localhost/test';

const expect = chai.expect;
const request = chai.request;
require('../server.js');

describe('playlist routes', () => {
  let user_id = 'makeitso22169';
  let playlist_id= '4KJ4SgELsFJRbUio4RHkRV';
  // before((done) => {
  //   passport.use(new SpotifyStrategy({
  //     clientID: client_id,
  //     clientSecret: client_secret,
  //     callbackURL: 'http://localhost:8888/callback'
  //   },
  //     (accessToken, refreshToken, profile, done) => {
  //       token = accessToken;
  //       console.log('token test', token);
  //       done();
  //     }
  //   ));
  //   done();
  // });

  it('should create a playlist', (done) => {
    request('localhost:8888')
    .post('/create/' + user_id)
    .set('name', 'testingtesting123')
    .set('token', access_token)
    .end((err,res) => {
      expect(err).to.eql(null);
      expect(res.body.Message).to.eql('Playlist Created!');
      done();
    });
  });
  it('should get playlist', (done) => {
    request('localhost:8888')
    .get('/playlist')
    .set('token', access_token)
    .end((err,res) => {
      expect(err).to.eql(null);
      expect(res.body.message).to.eql('Here is a playlist');
      done();
    });
  });
  it('should add a track', (done) => {
    request('localhost:8888')
    .post('/add/spotify:track:33vzOPcd9FRirYGlCu32x4')
    .set('authorization', 'Bearer ' + access_token)
    .end((err,res) => {
      expect(err).to.eql(null);
      expect(res.body.Message).to.eql('Track added!');
      done();
    });
  });
});
