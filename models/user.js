const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    user_img: {type: String, default: '디폴트는 뭐로하지'},
    email: {type: String, trim: true, unique: 1},
    username: String,
    password: String,
    favorite_arts: [{type: Schema.Types.ObjectId, ref: 'Art'}],
    favorite_artists: [{type: Schema.Types.ObjectId, ref: 'User'}],
    wallet_addr: String,
    my_arts:[{type: Schema.Types.ObjectId, ref: 'Art'}],
    onSale:[{type: Schema.Types.ObjectId, ref: 'Art'}],
});

userSchema.pre('save', function (next) {
    let user = this;

    if(user.isModified("password")) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

userSchema.methods.comparePassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password)
        .then((isMatch) => isMatch)
        .catch((err) => err);
};

userSchema.methods.generateToken = function () {
    const token = jwt.sign(this._id.toHexString(), "so!purple!");
    this.token = token;

    return this.save()
        .then((user) => user)
        .catch((err) => err);
};

userSchema.statics.findByToken = function (token) {
    let user = this;

    return jwt.verify(token, "so!purple!", function (err, decoded) {
        return user.findOne({_id: decoded, token: token})
            .then((user) => user)
            .catch((err) => err);
    });
};

userSchema.methods.addFavoriteArts = function (arts_id) {
    this.favorite_arts.push(arts_id);

    return this.save()
        .then((user) => user)
        .catch((err) => err);
};

userSchema.methods.deleteFavoriteArts = function (arts_id) {
  this.favorite_arts.pull(arts_id);

  return this.save()
      .then((user) => user)
      .catch((err) => err);

};

module.exports = mongoose.model('User', userSchema);