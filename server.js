'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const session = require('express-session');
const swig = require('swig');
const authRouter = require('./route/user-auth2');
const createRouter = require('./route/create-playlist');
const consolidate = require('consolidate');

const dbPort = process.env.MONGOLAB_URI || 'mongodb://localhost/dev_db';
mongoose.connect(dbPort);

app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.engine('html', consolidate.swig);


app.use('/', authRouter);

app.use('/', createRouter);

app.listen(8888, () => {
  console.log('Up on 8888');
});
