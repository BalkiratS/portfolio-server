var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var jwt = require('jsonwebtoken');
var cors = require('cors')


require('dotenv').config();

const getSecret = require('./secrets');

// Access a specific secret
(async () => {
  try {
    const secretValue = await getSecret("pserver/MDB");
    const mongostring = secretValue.DATABASE_URL;

    mongoose.connect(mongostring);
    const database = mongoose.connection;

    // Connect to database
    database.on('error', (error) => {
      console.log(error)
    })

    database.once('connected', () => {
      console.log('Database connected')
    })

  } catch (error) {
    console.error(`Error accessing secret: ${error}`);
  }
})();

var indexRouter = require('./routes/index');
var skillsRouter = require('./routes/skills');
var projectsRouter = require('./routes/projects');
var messageRouter = require('./routes/message');
var resumeRouter = require('./routes/resume');
const { error, log } = require('console');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/skills', skillsRouter);
app.use('/projects', projectsRouter);
app.use('/message', messageRouter);
app.use('/resume', resumeRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  // Only provide error details in development
  if (req.app.get('env') === 'development') {
    res.locals.message = err.message;
    res.locals.error = err;
  } else {
    // Log the error to the console in production for debugging
    console.error(err);
    res.locals.message = 'Something went wrong!'; // Generic message for users
  }

  res.render('error');
});


module.exports = app;
