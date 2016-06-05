'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const authRouter = require('./route/user-auth');
const createRouter = require('./route/create-playlist');

const dbPort = process.env.MONGOLAB_URI || 'mongodb://localhost/dev_db';
mongoose.connect(dbPort);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


app.use('/', authRouter);

app.use('/', createRouter);

app.listen(8888, () => {
  console.log('Up on 8888');
});
