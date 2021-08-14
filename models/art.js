const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artSchema = new Schema({
    img_path: String,
    name: String,
    artist: [{type: Schema.Types.ObjectId, ref: 'User'}],
    value: Number,
    view_count: Number,
    like_count: Number

});

artSchema.methods.increaseViewCount = function (art) {
    art.view_count++;

    return art.save();
}

artSchema.methods.increaseLikeCount = function (art) {
    art.like_count++;

    return art.save();
}

artSchema.methods.decreaseLikeCount = function (art) {
    art.like_count--;

    return art.save();
}

module.exports = mongoose.model('Art', artSchema);