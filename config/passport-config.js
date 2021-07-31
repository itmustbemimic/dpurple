const passport = require('passport');
const {Strategy: LocalStrategy} = require('passport-local');
const bcrypt = require('bcrypt');

require('dotenv').config();
const {SALT_FACTOR} = process.env;
const User = require('../models/user');


const passportVerify = async (email, password, done) => {
    try {
        const user = await User.find({email: email});

        if (!user) {
            done(null, false, {reason: '누구세요ㅕ'});
            return;
        }

        const compareResult = await bcrypt.compare(password, user.password);

        if (compareResult) {
            done(null, user);
            return;
        }
    } catch (error) {
        console.error(error);
        done(error);

    }
}

module.exports = () => {
    passport.use('local', new LocalStrategy(passportConfig, passportVerify));
}