const express = require('express');
const router = express.Router();
const Art = require('../models/art');
const User = require('../models/user');


//전체 작품 조회
router.get('/', (req, res) => {
    Art.find().populate('name', 'username')
        .then((arts) => {
            res.send(arts);
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
        })
        .catch((err) => {
            console.error(err);
        })


});

//작품 업로드
router.post('/', (req, res) => {

    //타임스탬프
    let date = new Date();
    let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' '
        + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()

    // const newbie = new Art({
    //     img: req.body.img,
    //     title: req.body.title,
    //     desc: req.body.desc,
    //     name: req.session.user_id,
    //     owner: req.session.user_id,
    //     price: req.body.price,
    //     views: 0,
    //     saves: 0,
    //     acc: 0,
    //
    //     price_klay: req.body.price_klay,
    //     price_krw: req.body.price_krw,
    //     ratio: req.body.ratio,
    //     nonce: req.body.nonce,
    //     time: time,
    //
    //     recent_price: {
    //         first: null,
    //         second: null,
    //         third: null,
    //         fourth: null,
    //         fifth: null,
    //         flag: null
    //     }
    // });

    req.body.name = req.session.user_id;
    req.body.owner = req.session.user_id;
    req.body.views = 0;
    req.body.saves = 0;
    req.body.acc = 0;
    req.body.time = time;
    req.body.recent_price.first = null;
    req.body.recent_price.second = null;
    req.body.recent_price.third = null;
    req.body.recent_price.fourth = null;
    req.body.recent_price.fifth = null;
    req.body.recent_price.flag = null;


    Art.create(req.body)
        .then(art => {
            res.send(art)

            User.findById(req.session.user_id)
                .then(user => {

                    //가격이 null이면 판매중 아님
                    if (art.price == null)
                        user.addNotOnSale(art._id);
                    else
                        user.addOnSale(art._id)
                })
        })
        .catch(err => res.status(500).send(err));


})

//작품 삭제
router.delete('/:id', (req, res) => {
    Art.findById(req.params.id)
        .then((art) => {
            //로그인아이디와 작품의 name이 일치할때 => 삭제
            if (art.name == req.session.user_id) {
                art.delete();
                res.sendStatus(200);
            } else {
                res.send('소유주만 삭제가 가능합니다.');
            }


        })
        .catch(err => res.status(500).send(err));

});


//작품 수정
router.put('/:id', (req, res) => {

    //수정 불가 항목 수정 시도 시 에러
    if (req.body._id || req.body.img || req.body.name || req.body.owner || req.body.views || req.body.saves || req.body.time) {
        res.send("수정 불가 항목")
        console.log("무단 수정 시도: ", req.session.user_id)
    } else {
        Art.findOneAndUpdate({_id: req.params.id, name: req.session.user_id},
            {$set: req.body},
            {new: true})
            .then((art) => {
                if (art)
                    res.send(art)
                else
                    res.send("소유주만 수정이 가능합니다")
            })
            .catch(err => res.status(500).send(err));

    }

});


//찜 클릭
router.get('/like/:id', (req, res) => {

    Art.findById(req.params.id)
        .then((art) => {

            User.findById(req.session.user_id)
                .then((user) => {

                    //좋아요를 처음 눌렀을때 => 유저 스키마에 작품아이디 추가, 작품 스키마에 카운트 +1
                    if (!user.favorite_arts.includes(req.params.id)) {
                        user.addFavoriteArts(req.params.id);
                        art.increaseLikeCount(art);
                    }

                    //좋아요를 두번 눌렀을때 => 유저 스키마에 작품아이디 삭제, 작품 스키마에 카운트 -1
                    else {
                        user.deleteFavoriteArts(req.params.id);
                        art.decreaseLikeCount(art);
                    }
                });

            res.send(art);
        })
        .catch((err) => {
            console.error(err);
        })
})


//거래시 액션 (테스트)
router.get('/recentqueuetest/:art_id/:price/:buyer_id', (req, res) => {

    //작품에 거래기록 추가
    Art.findById(req.params.art_id)
        .then((art) => {
            art.recordPrice(req.params.price);
            res.send(art);

            //원작자에게 체결액 누적
            User.findById(art.name)
                .then(artist => {
                    artist.addArtistACC(req.params.price);
                })
                .catch(err => console.log(err));

            //원작자와 판매자가 다를때는 판매자에게도 거래액 누적
            if (art.name != art.owner) {
                User.findById(art.owner)
                    .then(owner => {
                        owner.addSellAcc(req.params.price);
                    })
                    .catch(err => console.log(err));
            }


            //원작자와 판매자가 같을때는 중복 누적x 원작자에게만 누적 한번


        })
        .catch((err) => console.log(err));


})


module.exports = router;