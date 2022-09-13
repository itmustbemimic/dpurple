const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const passport = require('passport')

require('dotenv').config();
const {MONGO_URI, SEC} = process.env;


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const artsRouter = require('./routes/arts');
const imgRouter = require('./routes/images');
const rankRouter = require('./routes/rank');
const searchRouter = require('./routes/search');
const recommendRouter = require('./routes/recommends');
const authRouter = require('./routes/auth');
const mintingRouter = require('./routes/minting');


const app = express();
const passportConfig = require("./passport");
passportConfig();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(cookieParser());
app.use(
    cors({
        origin: true,
        credentials: false
    })
)


app.use(
    session({
        secret: SEC,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: MONGO_URI,
            collectionName: "sessions"
        })
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/arts', artsRouter);
app.use('/images', imgRouter);
app.use('/rank', rankRouter);
app.use('/search', searchRouter);
app.use('/recommends', recommendRouter);
app.use('/auth', authRouter);
app.use('/minting', mintingRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
//     .then(() => {console.log('connected to db');})
//     .catch(e => console.error(e));
//
//




module.exports = app;
