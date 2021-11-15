const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artSchema = new Schema({
    img: String,
    title: String,
    owner: {type: Schema.Types.ObjectId, ref: 'User'}, //소유주
    name: {type: Schema.Types.ObjectId, ref: 'User'}, //작가
    price: String, //현재 판매중인 가격, 0이면 판매중이 아님
    views: Number,
    saves: Number,


    //최근 거래 정보
    price_klay: String,
    price_krw: String,
    ratio: String,
    nonce: String,
    time: String,

    //최근 가격 변동 정보
    recent_price: {
        first: Number,
        second: Number,
        third: Number,
        fourth: Number,
        fifth: Number,
        flag: Number //여기에 적혀있는 값이 마지막 거래 가격
    }

});

//조회수 증가
artSchema.methods.increaseViewCount = function (art) {
    art.views++;

    return art.save();
}

//좋아요 증가
artSchema.methods.increaseLikeCount = function (art) {
    art.saves++;

    return art.save();
}

//좋아요 감소
artSchema.methods.decreaseLikeCount = function (art) {
    art.saves--;

    return art.save();
}

artSchema.methods.recordPrice = function (art, price) {
    
    //flag에 적혀있는 값이 마지막 거래 가격
    switch (art.recent_price.flag) {
        case 1:
            art.recent_price.second = price;
            art.recent_price.flag++
            break;
        case 2:
            art.recent_price.third = price;
            art.recent_price.flag++
            break;
        case 3:
            art.recent_price.fourth = price;
            art.recent_price.flag++
            break;
        case 4:
            art.recent_price.fifth = price;
            art.recent_price.flag++
            break;
        case 5:
            art.recent_price.first = price;
            art.recent_price.flag = 1
            break;

        //flag == null => 거래기록이 없다.
        default:
            art.recent_price.first = price;
            art.recent_price.flag = 1
            break;
    }

    return art.save();
}

module.exports = mongoose.model('Art', artSchema);