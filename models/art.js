const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artSchema = new Schema({
    img: String,
    title: String,
    desc: String,
    name: {type: Schema.Types.ObjectId, ref: 'User'}, //작가
    owner: {type: Schema.Types.ObjectId, ref: 'User'}, //소유주
    price: Number, //현재 판매중인 가격, 0이면 판매중이 아님
    views: Number,
    saves: Number,
    acc: Number, //누적 체결액


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
artSchema.methods.increaseViewCount = function () {
    this.views++;

    return this.save();
}

//좋아요 증가
artSchema.methods.increaseLikeCount = function () {
    this.saves++;

    return this.save();
}

//좋아요 감소
artSchema.methods.decreaseLikeCount = function () {
    this.saves--;

    return this.save();
}

artSchema.methods.recordPrice = function (price) {

    //flag에 적혀있는 값이 마지막 거래 가격
    switch (this.recent_price.flag) {
        case 1:
            this.recent_price.second = price;
            this.recent_price.flag++
            break;
        case 2:
            this.recent_price.third = price;
            this.recent_price.flag++
            break;
        case 3:
            this.recent_price.fourth = price;
            this.recent_price.flag++
            break;
        case 4:
            this.recent_price.fifth = price;
            this.recent_price.flag++
            break;
        case 5:
            this.recent_price.first = price;
            this.recent_price.flag = 1
            break;

        //flag == null => 거래기록이 없다.
        default:
            this.recent_price.first = price;
            this.recent_price.flag = 1
            break;
    }

    //누적 금액 추가
    this.acc += Number(price);


    return this.save();
}

module.exports = mongoose.model('Art', artSchema);