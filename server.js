'use strict';

const app = require('express')();
const mongoose = require('mongoose');
const authRouter = require('./route/user-auth');
const createRouter = require('./route/create-playlist');

const dbPort = process.env.MONGOLAB_URI || 'mongodb://localhost/dev_db';
mongoose.connect(dbPort);

app.use('/', authRouter);

app.use('/', createRouter);

app.listen(8888, () => {
  console.log('Up on 8888');
});
