const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artSchema = new Schema({
    img_path: String,
    name: String,
    artist: String,
    value: Number
});

artSchema.statics.findAll = function () {
    return this.find({});
}

artSchema.statics.create = function (payload) {
    const art = new this(payload);
    return art.save();
}

artSchema.statics.deleteById = function (id) {
    return this.remove({id});
}

artSchema.statics.findOneByName = function (name) {
    return this.findOne({name});
}


module.exports = mongoose.model('Art', artSchema);