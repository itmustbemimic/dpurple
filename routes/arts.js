const express = require('express');
const router = express.Router();
const Art = require('../models/art');

//전체 작품 조회
router.get('/', (req, res) => {
    Art.find()
        .then((arts) => {
            res.send(arts);
            console.log(arts);
        })
        .catch((err) => {
            console.error(err);
        })

});

//개별 작품 조회
router.get('/:id', (req, res) => {
    Art.findById(req.params.id)
        .then((art) => {
            art.increaseViewCount(art);
            res.send(art);
            console.log(art);
        })
        .catch((err) => {
            console.error(err);
        })


});

//작품 업로드
router.post('/', (req, res) => {
    console.log(req.body);

    Art.create(req.body)
        .then(art => res.send(art))
        .catch(err => res.status(500).send(err));
})

//작품 삭제
router.delete('/:id', (req, res) => {
    Art.findByIdAndDelete(req.params.id)
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send(err));

});


//작품 수정
router.put('/:id', (req, res) => {
    Art.findByIdAndUpdate(req.params.id, req.body)
        .then(art => res.send(art))
        .catch(err => res.status(500).send(err));
});


//찜 클릭
router.get('/like/:id', (req, res) => {
    Art.findById(req.params.id)
        .then((art) => {
            art.increaseLikeCount(art);
            res.send(art);
            console.log(art);
        })
        .catch((err) => {
            console.error(err);
        })
})


module.exports = router;
