const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
//const passport = require('./config/passport-config');

require('dotenv').config();

const {MONGO_URI, COOKIE_SEC} = process.env;


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const artsRouter = require('./routes/arts');
const imgRouter = require('./routes/images');
const rankRouter = require('./routes/rank');


const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(cookieParser(COOKIE_SEC));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/arts', artsRouter);
app.use('/images', imgRouter);
app.use('/rank', rankRouter);


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

mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('connected to db'))
    .catch(e => console.error(e));


app.use(
    session({
        secret: COOKIE_SEC,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: MONGO_URI
        })
    })
);

// app.use(passport.initialize);
// app.use(passport.session);


module.exports = app;
