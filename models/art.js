const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artSchema = new Schema({
    img: String,
    title: String,
    name: {type: Schema.Types.ObjectId, ref: 'User'},
    price: String, //현재 판매중인 가격, 0이면 판매중이 아님
    views: Number,
    saves: Number,


    //최근 거래 정보
    price_klay: String,
    price_krw: String,
    ratio: String,
    nonce: String,
    time: String

});

artSchema.methods.increaseViewCount = function (art) {
    art.views++;

    return art.save();
}

artSchema.methods.increaseLikeCount = function (art) {
    art.saves++;

    return art.save();
}

artSchema.methods.decreaseLikeCount = function (art) {
    art.saves--;

    return art.save();
}

module.exports = mongoose.model('Art', artSchema);