const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const {SEC} = process.env;

const userSchema = new Schema({
    user_img: {type: String, default: '/images/default.png'},
    email: {type: String, trim: true, unique: 1},
    username: String,
    password: String,
    favorite_arts: [{type: Schema.Types.ObjectId, ref: 'Art'}],
    favorite_artists: [{type: Schema.Types.ObjectId, ref: 'User'}],
    wallet_addr: String,
    onSale: [{type: Schema.Types.ObjectId, ref: 'Art'}],
    notOnSale: [{type: Schema.Types.ObjectId, ref: 'Art'}],
    acc_artist: Number, //본인 작품 누적 거래액
    acc_seller: Number, //개인 누적 거래액
    birth: Date
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
    const token = jwt.sign(this._id.toHexString(), SEC);
    this.token = token;

    return this.save()
        .then((user) => user)
        .catch((err) => err);
};

userSchema.statics.findByToken = function (token) {
    let user = this;

    return jwt.verify(token, SEC, function (err, decoded) {
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

userSchema.methods.addFavoriteUsers = function (user_id) {
    this.favorite_artists.push(user_id);

    return this.save()
        .then()
        .catch(err => console.log(err))
}

userSchema.methods.deleteFavoriteUsers = function (user_id) {
    this.favorite_artists.pull(user_id);

    return this.save()
        .then()
        .catch(err => console.log(err))
}

userSchema.methods.switchToSale = function (arts_id) {
    this.onSale.addToSet(arts_id);
    this.notOnSale.pull(arts_id);

    return this.save()
        .then((user) => user)
        .catch((err) => err);

};

userSchema.methods.switchToNotSale = function (arts_id) {
    this.notOnSale.addToSet(arts_id);
    this.onSale.pull(arts_id);

    return this.save()
        .then((user) => user)
        .catch((err) => err);

};

userSchema.methods.addSellAcc = function (price) {
    this.acc_seller += Number(price);

    return this.save()
        .then((user) => user)
        .catch((err) => err);
}

userSchema.methods.addArtistACC = function (price) {
    this.acc_artist += Number(price);

    return this.save()
        .then(user => user)
        .catch(err => err);
}

module.exports = mongoose.model('User', userSchema);