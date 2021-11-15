const express = require('express');
const router = express.Router();
const Recommend = require('../models/recommend');
const Art = require('../models/art')
const User = require('../models/user')

router.get('/', (req, res) => {
    Recommend.find().populate({
        path: 'art_id',
        populate: { path: 'name', select: 'username'}
    })
        .then((recommends) => {
            res.send(recommends);
        })
        .catch((err) => {
            console.error(err);
        });
});

//추천작 등록
router.post('/', (req, res) => {
    const recommend = new Recommend({
        art_id: req.body.art_id
    });

    Recommend.create(recommend)
        .then(art => res.send(art))
        .catch(err => console.error(err));
})

//추천작 삭제
router.delete('/', (req, res) => {
    Recommend.findOneAndDelete({art_id: req.body.art_id})
        .then(res.sendStatus(200))
        .catch(err => console.error(err));
})


//작품별 추천작 (해당작가 제일 많은 뷰)
router.get('/:name', (req, res) => {
    Art.find({name: req.params.name}).sort({views: -1}).limit(5)
        .then((recommends) => {
            res.send(recommends);
        })
        .catch(err => console.error(err));
})








module.exports = router;