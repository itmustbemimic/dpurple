const express = require('express');
const router = express.Router();
const Recommend = require('../models/recommend');

router.get('/', (req, res) => {
    Recommend.find().populate('art_id')
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



module.exports = router;