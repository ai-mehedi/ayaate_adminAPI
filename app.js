require("dotenv").config();
require('./utils/passport-config');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require("helmet");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const mongoose = require('mongoose');

const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');


var indexRouter = require('./routes/index');
let uploadRouter = require('./routes/upload');
let apiRouter = require('./Router');

var app = express();
app.use(express.json());

mongoose.connect(`${process.env.MONGO_URI}`);

const db = mongoose.connection;

// Connection successful
db.once('open', () => {
  console.log('MongoDB connected');
});

// Connection error
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}));

app.use(passport.initialize());
app.use(passport.session());


// Swagger Docs
// Swagger inline config
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API with inline Swagger",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./routes/*.js"], // 👈 This scans route files for Swagger comments
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

app.use('/', indexRouter);
app.use('/upload', uploadRouter);
app.use('/api', apiRouter);

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
