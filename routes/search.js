const express = require('express');
const router = express.Router();
const Art = require('../models/art');
const User = require('../models/user')

router.get('/:keyword', (req, res) => {

    const keyword = new RegExp(req.params.keyword);

    //작품명으로 검색
    if (req.query.option == 'title') {
        Art.find({title: keyword})
            .then((arts) => {
                res.send(arts);

            })
            .catch((err) => {
                console.log(err);
            })

        //작가명으로 검색
    } else if (req.query.option == 'artist') {
        User.findOne({username: keyword})
            .then((user) => {
                res.send(user);
            })
            .catch(err => console.log(err));


        //같이 검색
    } else if (req.query.option == null){



        // Art.find({$or: [{title: keyword}, {name: null}]})
        //     .then((arts) => {
        //         res.send(arts + "," + usertest)
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     })



        //res.send("통합검색은 아직!")
    } else {
        res.status(404).send('뒤진다');
    }


});


module.exports = router;