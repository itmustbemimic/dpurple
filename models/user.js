const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

require('dotenv').config();
const {SALT_FACTOR} = process.env;

const userSchema = new Schema({
    user_img: {type: String, default: '디폴트는 뭐로하지'},
    email: String,
    username: String,
    password: String,
    social: {
        naver: {
            id: String,
            accessToken: String
        },
        google: {
            id: String,
            accessToken: String
        }
    },
    favorite_arts: [{type: Schema.Types.ObjectId, ref: 'Art'}],
    favorite_artists: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

userSchema.pre("create", (done) => {
    let user = this;


    if (user.isModified("password")) {
        bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
            if (err) return done(err);

            bcrypt.hash(user.password, salt, (err, hashedPassword) => {
                if (err) return done(err);
                user.password = hashedPassword;
                done();
            });
        });
    } else {
        done();
    }
});

userSchema.methods.comparePassword = function (plainPw) {
   return bcrypt.compare(plainPw, this.password)
       .then((isMatch) => isMatch)
       .catch((err) => console.error(err));
};


module.exports = mongoose.model('User', userSchema);