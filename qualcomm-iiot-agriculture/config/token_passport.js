var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var tokenUser = require('../model/token_fun.js');

module.exports = function(passport) {
    
    passport.use(new LocalStrategy({
        usernameField: 'emailId',
        passwordField: 'password',
        passReqToCallback: true,
        session: false
    },
    function(req, emailId, password, done) { 
        console.log('Token: the password we are checking is', password,emailId);
        tokenUser.localfindOne(emailId, password, function(err, returningUser, data) {
            var user = data;
            console.log(user);
            if (err) {
                var responseData = { 
                    status: false, 
                    message: 'Authentication failed.'
                };
                res.json(responseData);
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
       }
    ));
}