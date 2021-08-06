const express = require('express');
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

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
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) {
            console.log(err)
            return res.json({success: false, err});
        }
        return res.status(200).json({success: true});
    });
})

router.post('/login', (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (user == null) {
            return res.json({
                success: false,
                message: "누구세요"
            });
        }

        user.comparePassword(req.body.password)
            .then((isMatch) => {
                if (!isMatch) {
                    return res.json({
                        success: false,
                        message: "비밀번호 오류"
                    });
                }

                user.generateToken()
                    .then((user) => {
                        res.cookie("x_auth", user.token)
                            .status(200)
                            .json({success: true, userId: user._id});
                    })
                    .catch((err) => {
                        res.status(400).send(err);
                        console.log(err);
                    });
            })
            .catch(err => res.json({success: false, err}));
    })
})


router.get('/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req._id,
        isAuth: true,
        user_img: req.user_img,
        email: req.email,
        username: req.username,
        favorite_arts: req.favorite_arts,
        favorite_artist: req.favorite_artist
    })

})

module.exports = router;
