const express = require('express');
const router = express.Router();
const User = require("../models/user");



router.post('/test', (req, res) => {
    User.create(req.body)
        .then(user => res.send(user))
        .catch(err => res.status(500).send(err));
})

router.get('/users', (req, res) => {
    User.find()
        .then((users) => {
            res.send(users);
        })
        .catch((err) => {
            console.error(err);
        })
});

router.post('/register', (req, res) => {
    User.create(req.body)
        .then(user => res.send(user))
        .catch(err => res.status(500).send(err));
})


router.post('/login', (req, res) => {
    User.find({email: req.body.email}, (err, user) => {
        if (err) {
            return res.json({
                loginSuccess: false,
                message: "누구세요"
            });
        }
    })
        .then((user) => {
            console.log(req.body.password);
            user.comparePassword(req.body.password)
                .then((isMatch) => {
                    if (!isMatch) {
                        return res.json({
                            loginSuccess: false,
                            message: "비밀번호 틀림"
                        });
                    }
                    return res.json({
                        loginSuccess: true
                    })
                })
        })
        .catch((err) => console.error(err))
})

router.get('/logout',(req, res) => {
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
