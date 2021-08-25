const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Art = require('../models/art');
const auth = require("../middleware/auth");

router.get('/test', (req, res) => {
    if (!req.session.user_id) {
        return res.send('로그인 안했자나요')
    }
    console.log(req.session.user_id);
    console.log(req.session.logined);
    User.findById(req.session.user_id, (err, user) => {
        res.send(user.username);
    })

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

router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            res.send(user);
        })
        .catch((err) => {
            console.error(err);
        });
});

router.get('/:id/onsale', (req, res) => {
    User.findById(req.params.id).populate('onSale')
        .then((user) => {
            res.send(user.onSale);
        })
        .catch((err) => {
            console.error(err);
        });
});

router.get('/:id/notonsale', (req, res) => {
    User.findById(req.params.id).populate('notOnSale')
        .then((user) => {
            res.send(user.notOnSale);
        })
        .catch((err) => {
            console.error(err);
        });
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
        console.log(user);
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

                // user.generateToken()
                //     .then((user) => {
                //         res.cookie("x_auth", user.token)
                //             .status(200)
                //             .json({success: true, userId: user._id});
                //     })
                //     .catch((err) => {
                //         res.status(400).send(err);
                //         console.log(err);
                //     });
                console.log('sdfsdfdsf')
                req.session.user_id = user._id;
                req.session.logined = true;
                res.send('hi ' + user.username);
            })
            .catch(err => res.json({success: false, err}));
    })


})


router.get('/logout', (req, res) => {
    // User.findByIdAndUpdate(req.user._id, {token: ""}, (err, user) => {
    //     if (err)
    //         return res.json({
    //             success: false, err
    //         });
    //
    //     res.clearCookie("x_auth");
    //
    //     return res.status(200).send({success: true});
    // });

    req.session.destroy();
    res.send('logout!')


});


router.get('/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req._id,
        isAuth: true,
        user_img: req.user_img,
        email: req.email,
        username: req.username,
        favorite_arts: req.favorite_arts,
        favorite_artist: req.favorite_artist
    });

});

router.post('/sell/:user_id/:arts_id', (req, res) => {
    //user_id 나중에 req.session.user_id로 바꾸기
    User.findById(req.params.user_id)
        .then((user) => {
            user.switchToSale(req.params.arts_id);
            res.send(user.onSale);
        })

    Art.findById(req.params.arts_id)
        .then((art) => {
            art.price = req.body.price;
            art.save();
        }
    )
})

router.post('/notsell/:user_id/:arts_id', (req, res) => {
    //user_id 나중에 req.session.user_id로 바꾸기
    User.findById(req.params.user_id)
        .then((user) => {
            user.switchToNotSale(req.params.arts_id);
            res.send(user.notOnSale);
        })

    Art.findById(req.params.arts_id)
        .then((art) => {
                art.price = "0";
                art.save();
            }

        )
})

module.exports = router;
