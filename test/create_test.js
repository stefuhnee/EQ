'use strict';
const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);

//const client_id = process.env.CLIENT_ID;
//const client_secret = process.env.CLIENT_SECRET;
//const redirect_uri = 'http://localhost:8888/callback'
const createPL = require('../route/manage-playlist.js');
const auth = require('../route/user-auth.js');
//const userAuth = require('../route/user-auth.js');
//const httpRequest = require('request');

// const mongoose = require('mongoose');
// const dbPort = process.env.MONGOLAB_URI;
// process.env.MONGOLAB_URI = 'mongodb://localhost/test';

const expect = chai.expect;
const request = chai.request;
require('../server.js');

describe('playlist routes', () => {
  let user_id = 'makeitso22169';
  let token = 'BQCJC9TBNMvYLCFYddw1JQ5YnM2Gk_OdZWb5IOB-NIJy9lZiqmkpu0CO8JeYhEfmn5r3OqSXgzcVfT9RqVi3BNPu-3uGqcphXV6ztH57E_YNHK4YSOQApVXpNBqGaVn9lCEn1BB3a05JBpGZ_31gnfLNxJUUna_MIB3HLzNeYiCBdP4YjRSGSSVO3oNAUOs-fFhAmnbFOi5bDoKOuwQ';
  let playlist_id= '4KJ4SgELsFJRbUio4RHkRV'
  it('should create a playlist', (done) => {
    request('localhost:8888')
    .post('/create/' + user_id)
    .set('name', 'testingtesting123')
    .set('token', token)
    .end((err,res) => {

      expect(err).to.eql(null);
      expect(res.body.Message).to.eql('Playlist Created!');
      done();
    });
  });
  it('should get playlist', (done) => {
    request('localhost:8888')
    .get('/playlist')
    .set('token', token)
    .end((err,res) => {
    //expect goes here....
      done();
    });
  });
  it('should add a track', (done) => {
    request('localhost:8888')
    .post('/add/33vzOPcd9FRirYGlCu32x4')
    .set('authorization', 'Bearer ' + token)
    .end((err,res) => {
      expect(err).to.eql(null);
      expect(res.body.message).to.eql('Track Added');
      done();
    });
  });
});
