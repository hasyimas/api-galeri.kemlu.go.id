const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');

// const client = require("./app/config/ldap.config")

// client.on('connect', (err) => {
//   console.log(`LDAP connection Success`)
// })

// client.on('error', (err) => {
//   console.log(`LDAP can't connection`, err)
//   process.exit()
// })

const db = require("./app/models")
mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`mongoDB Connected Success`)
  })
  .catch((err) => {
    console.log(`Database cant connection`, err)
    process.exit()
  });

var indexRouter = require('./app/routes/index');
var dashboardRouter = require('./app/routes/dashboards');
var filesInformationRouter = require('./app/routes/files-information');
var usersRouter = require('./app/routes/users');
var authRouter = require('./app/routes/auth');
var galleriesRouter = require('./app/routes/galleries');
var photosRouter = require('./app/routes/photos');
var bannersRouter = require('./app/routes/banners');
var videosRouter = require('./app/routes/videos');
var audiosRouter = require('./app/routes/audios');

var logVisitorLogin = require('./app/routes/log-visitor-login');
var logUsersLogin = require('./app/routes/log-users-login');
var filesDownload = require('./app/routes/files-download');

// --------------------
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/uploads', express.static('public/uploads/'));


app.use('/', indexRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/files-information', filesInformationRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/galleries', galleriesRouter);
app.use('/api/photo', photosRouter);
app.use('/api/banner', bannersRouter);
app.use('/api/video', videosRouter);
app.use('/api/audio', audiosRouter);

app.use('/api/log-visitor-login', logVisitorLogin);
app.use('/api/log-users-login', logUsersLogin);
app.use('/api/files-download', filesDownload);

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

module.exports = app;