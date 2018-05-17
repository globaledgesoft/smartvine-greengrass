var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var sessionUser = require('../model/session_fun.js');


//echo "http://".$_SERVER['SERVER_NAME'].$_SESSION['page'];

module.exports = function(passport) {
    passport.serializeUser(function (user, done) {
        console.log('the user got serizalized');
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        console.log(id, ' is starting to be deserialized with passport.js');
        sessionUser.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
            usernameField : 'emailId',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, emailId, password, done) { 
            console.log('the password we are checking is', password,emailId);
            sessionUser.localfindOne(emailId, password, function(err, returningUser, data, user) {
                var user = data;
                console.log(user);
                if (err) {
                    return done(err);
                }
                if (!returningUser) {
                    return done(null, false);
                }
                if (returningUser === true && req.body.password !== password) {
                    console.log('the user is found but the password does not match!');
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 
                }
                else {
                    console.log('the user', user, 'should go to profile!');
                    return done(null, user);
                }
            });
    }));
};
