const express = require('express');
const router = express.Router();
//const passport = require('./config/passport-config');

// router.post('/login', passport.authenticate('local', {failureRedirect: '/'}),
//     (req, res) => {
//         res.redirect('/');
//     }
// );


router.get('/logout', function (req, res, next) {
    try {
        if (req.session) {
            req.session.destroy();
        }
        res.redirect(req.headers.referer);
    } catch (err) {
        console.log(err);
        res.redirect(req.headers.referer);
    }
});

module.exports = router;
