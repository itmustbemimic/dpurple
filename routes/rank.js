const express = require('express');
const router = express.Router();
const Art = require('../models/art');


//조회수
router.get('/view', (req, res) => {
    Art.find().sort({view_count: -1}).limit(5)
        .then((arts) => {
            res.send(arts);
            console.log(arts);
        })
        .catch((err) => {
            console.log(err);
        })
});


//찜수
router.get('/like', (req, res) => {
    Art.find().sort({like_count: -1}).limit(5)
        .then((arts) => {
            res.send(arts);
            console.log(arts);
        })
        .catch((err) => {
            console.log(err);
        })

});

module.exports = router;