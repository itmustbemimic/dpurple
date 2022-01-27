const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/user');

module.exports = () => {
    passport.use(new KakaoStrategy( {
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        //console.log('kakao profile', profile);
        try {
            const exUser = await User.findOne({snsId: profile._id});

            if (exUser) {
                done(null, exUser);
            }
            else {
                const newUser = await User.create({
                    email: profile._json && profile._json.kakao_account_email,
                    username: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao'
                });
                console.log('//////////')
                console.log(newUser);
                done(null, newUser);
            }
        }catch (error) {
            console.error(error);
        }
        }));
};