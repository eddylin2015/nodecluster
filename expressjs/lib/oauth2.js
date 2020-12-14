'use strict';

const express = require('express');
// [START setup]
const passport = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
//const users = require('./internal_users_redis');
const users = require('./users');

function extractProfile  (profile) {
    let imageUrl = '';
    if (profile.photos && profile.photos.length) {
        imageUrl = profile.photos[0].value;
    }
    return {
        id: profile.id,
        displayName: profile.displayName,
        image: imageUrl
    };
}
// Configure the local strategy for use by Passport.
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new LocalStrategy (function (username, password, cb) {
    //users.js
    users.findByUsername(username, function (err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
    });
    /* / internal_users.js
    users.findByUsernamePassword(username, password, function (err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if(user.password.length==33){ }
        else
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
    });
    */

}));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});
// [END setup]

const router = express.Router();

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/auth/login' }),
    (req, res)=> {
        if(req.query.redirect){
            res.redirect(''+req.query.redirect+"/");
        }else{
            res.redirect('/');
        }
    });
router.post('/auth/login',
    passport.authenticate('local', { failureRedirect: '/auth/login' }),
    (req, res)=> {
        if(req.query.redirect){
            res.redirect(''+req.query.redirect+"");
        }else{
            res.redirect('/');
        }
    });
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
router.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
router.get('/auth/reload', (req, res) => {
    //req.logout();
    res.redirect('/');
});
function authRequired  (req, res, next) {
    if (!req.user) {
        req.session.oauth2return = req.originalUrl;
        return res.redirect('/auth/login');
    }
    next();
}
// Middleware that exposes the user's profile as well as login/logout URLs to
// any templates. These are available as `profile`, `login`, and `logout`.
function addTemplateVariables  (req, res, next) {
    res.locals.profile = req.user;
    res.locals.login = `/auth/login?return=${encodeURIComponent(req.originalUrl)}`;
    res.locals.logout = `/auth/logout?return=${encodeURIComponent(req.originalUrl)}`;
    next();
}
module.exports = {
    extractProfile: extractProfile,
    router: router,
    required: authRequired,
    template: addTemplateVariables
};