const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const eca = require('restful-node');
const { setupMongoose } = eca.database;

const app = express();

// Set logger to only print detailed
// responses, if NODE_ENV is not in production
let logger = null;
if (app.get('env') === 'production') {
  logger = morgan('combined', {
    skip: function (req, res) {
      return res.statusCode < 400 // Only log messages with error type severity
    }
  });
} else {
  logger = morgan('dev');
}

app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

///////////////////////////
//  DATABASE CONNECTION  //
// Provide configuration //
// as parameter          //
///////////////////////////
const db = setupMongoose({ database: 'hello-world' });

///////////////////////////
//  ROUTE REGISTRATION   //
// Also handles errors   //
///////////////////////////
const HelloWorld = require('./controller/hello-world');

const { urls } = eca.routes;
urls(app, '/api', [
  { controller: new HelloWorld() }
]);

module.exports = app;
