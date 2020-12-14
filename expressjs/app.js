
'use strict';

const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const config = require('./config');
//const {Datastore} = require('@google-cloud/datastore');
//const DatastoreStore = require('@google-cloud/connect-datastore')(session);

const app = express();

app.disable('etag');
app.use(require('morgan')('combined'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('trust proxy', true);

// [START session]
// Configure the session and session storage.
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));//default false

app.use(session({  
    resave: false,
    saveUninitialized: false,
    secret: config.get('SECRET'),
    signed: true,
    store: new RedisStore({host:config.get('REDISHOST')}),
}));

// [END session]

// OAuth2
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./lib/oauth2').router);

//public static
app.use(express.static(path.join(__dirname, 'public')));

// Books
app.use('/assetmng', require('./assetmng/crud'));
app.use('/api/assetmng', require('./assetmng/api'));

// Redirect root to /books
app.get('/', (req, res) => {
  //res.redirect('/assetmng');
  res.render('index.pug', {
    profile:req.user,
    login : `/auth/login?return=${encodeURIComponent(req.originalUrl)}`,
    logout : `/auth/logout?return=${encodeURIComponent(req.originalUrl)}`
  });
});
app.get('/auth/login',    function (req, res) {
  //console.log(req.query.return);
  res.render('login',{redirect:req.query.return});
});

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Basic error handler
app.use((err, req, res) => {
  /* jshint unused:false */
  console.error(err);
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  res.status(500).send(err.response || 'Something broke!');
});

const server = app.listen(8081, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
});

