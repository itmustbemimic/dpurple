const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Art = require('../models/art');
const auth = require("../middleware/auth");


//로그아웃
router.post('/logout', (req, res) => {

    req.session.destroy();
    res.json({
        success : true
    })


});

//로그인 여부 테스트
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


//전체 유저목록 출력 (테스트용)
router.get('/users', (req, res) => {
    User.find()
        .then((users) => {
            res.send(users);
        })
        .catch((err) => {
            console.error(err);
        })
});


//개별 유저 프로필
router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .then((user) => {
            res.send(user);
        })
        .catch((err) => {
            console.error(err);
        });
});

//해당유저의 판매중 작품
router.get('/:id/onsale', (req, res) => {
    User.findById(req.params.id).populate('onSale')
        .then((user) => {
            res.send(user.onSale);
        })
        .catch((err) => {
            console.error(err);
        });
});

//해당유저의 판매중이 아닌 작품
router.get('/:id/notonsale', (req, res) => {
    User.findById(req.params.id).populate('notOnSale')
        .then((user) => {
            res.send(user.notOnSale);
        })
        .catch((err) => {
            console.error(err);
        });
});


//회원가입
router.post('/register', (req, res) => {


    req.body.onSale = [];
    req.body.notOnSale = [];
    req.body.acc_artist = 0;
    req.body.acc_seller = 0;

    console.log(req.body)

    const user = new User(req.body);


    user.save((err, userInfo) => {
        if (err) {
            console.log(err)
            return res.json({success: false, err});
        }
        return res.status(200).json({success: true});
    });
})


//로그인
router.post('/login', (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        console.log(user);
        if (user == null) {
            return res.json({
                success: false,
                message: "등록된 이메일 없음"
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


                req.session.user_id = user._id;
                req.session.logined = true;
                res.json({
                    success: true,
                    user_id: user._id,
                    username: user.username
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
    });

});


//판매중이 아닌 작품을 판매중으로 변경
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

//판매중 작품을 판매중이 아님으로 변경
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


router.get('/like/:artist_id', (req, res) => {
    User.findById(req.session.user_id)
        .then((user) => {

            //좋아요를 처음 눌렀을때 => favorite_artists에 유저아이디 추가
            if (!user.favorite_artists.includes(req.params.artist_id))
                user.addFavoriteUsers(req.params.artist_id);

            //같은유저를 두번 눌렀을때 => favorite_artists에서 해당 유저아이디 삭제
            else
                user.deleteFavoriteUsers(req.params.artist_id);

            res.send(user);
        })
        .catch(err => console.log(err))
})


module.exports = router;
