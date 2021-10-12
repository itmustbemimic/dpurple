const express = require('express');
const router = express.Router();
const Art = require('../models/art');

router.get('/:keyword', (req, res) => {

    console.log(req.query.option);

    const keyword = new RegExp(req.params.keyword);

    //작품명으로 검색
    if (req.query.option == 'name') {
        console.log('name!!');
        Art.find({title: keyword})
            .then((arts) => {
                res.send(arts);

            })
            .catch((err) => {
                console.log(err);
            })

        //작가명으로 검색
    } else if (req.query.option == 'artist') {
        console.log('artist!!');
        Art.find({name: keyword})
            .then((arts) => {
                res.send(arts);

            })
            .catch((err) => {
                console.log(err);
            })

        //같이 검색
    } else if (req.query.option == null ){
        Art.find({$or: [{title: keyword}, {name: keyword}]})
            .then((arts) => {
                res.send(arts);

            })
            .catch((err) => {
                console.log(err);
            })
    } else {
        res.status(404).send('뒤진다');
    }


});


module.exports = router;