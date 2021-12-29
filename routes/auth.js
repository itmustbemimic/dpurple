const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');
const router = express.Router();


//회원가입
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, username, password } = req.body;

    try {
        const exUser = await User.findOne({email: email});
        if (exUser) {
            return res.redirect('/join?error=exist');
        }

        const hash = await bcrypt.hash(password, 10);
        await User.create({
            email,
            username,
            password: hash
        });
        return res.redirect('/');

    } catch (error) {
        console.error(error);
        return next(error);
    }
});



router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }

        if (!user) {
            console.log(info.message);
            return res.send(info.message);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            req.session.user_id = user._id;
            return res.send('로그인 성공');
        });
    })(req, res, next);
});


router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('로그아웃 성공');
})


module.exports = router;