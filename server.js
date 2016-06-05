'use strict';

const app = require('express')();
const authRouter = require('./route/user-auth');

app.use('/', authRouter);

app.listen(8888, () => {
  console.log('Up on 8888');
});
