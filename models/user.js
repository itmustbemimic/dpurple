const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_img: String,
    email: String,
    username: String,
    password: String,
    favorite_arts: String,
    favorite_artists: String
});

// userSchema.statics.findAll = function () {
//     return this.find({});
// }
//
// userSchema.statics.create = function (payload) {
//     const user = new this(payload);
//     return user.save();
// }
//
// userSchema.statics.deleteById = function (id) {
//     return this.remove({id});
// }
//
// userSchema.statics.findOneByName = function (name) {
//     return this.findOne({name});
// }


module.exports = mongoose.model('User', userSchema);