const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artSchema = new Schema({
    img: String,
    title: String,
    name: {type: Schema.Types.ObjectId, ref: 'User'},
    price: Number,
    views: Number,
    saves: Number,
    onSale: Boolean
    //판매중 여부 boolean

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