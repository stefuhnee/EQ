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
