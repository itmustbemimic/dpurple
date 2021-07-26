const passport = require('passport');
const LocalStrategy = require('passport').Strategy;
const User = require('../models/art');

passport.use('something',
    new LocalStrategy(
        {
            _usernameField: 'id',
            _passwordField: 'pw'
        },
        function (username, password, done) {
            User.findOne({id: username}, (err, user) => {
                if (user) {
                    if (password == user.password) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'Incorrect password'});
                    }
                } else {
                    return done(null, false, {message: 'Incorrect ID'});
                }
            });
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    User.findOne({_id: id}, (err, user) => {
        done(null, user);
    });
});


module.exports = passport;