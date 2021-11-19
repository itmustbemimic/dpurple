const express = require('express');
const router = express.Router();
const Art = require('../models/art');
const User = require('../models/user');


//조회수
router.get('/art/view', (req, res) => {
    Art.find().sort({views: -1}).limit(5)
        .then((arts) => {
            res.send(arts);
        })
        .catch((err) => {
            console.log(err);
        })
});


//찜수
router.get('/art/like', (req, res) => {
    Art.find().sort({saves: -1}).limit(5)
        .then((arts) => {
            res.send(arts);
        })
        .catch((err) => {
            console.log(err);
        })

});

//체결액순 top5 작품
router.get('/art/acc', (req, res) => {
    Art.find().sort({acc: -1}).limit(5)
        .then((arts) => {
            res.send(arts);
        })
        .catch(err => console.log(err));
})

//아티스트 랭킹 체결액순
router.get('/artist/acc', (req, res) => {
    User.find().sort({acc_artist: -1}).limit(5)
        .then(artists => {
            res.send(artists);
        })
        .catch(err => console.log(err));
})

//개인 누적 체결액순
router.get('/user/acc', (req, res) => {
    User.find().sort({acc_seller: -1}).limit(5)
        .then(user => {
            res.send(user);
        })
        .catch(err => console.log(err));
})

module.exports = router;