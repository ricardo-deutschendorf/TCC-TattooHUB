var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var expressLayouts = require("express-ejs-layouts");
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cadastroRouter = require('./routes/cadastro');
var loginRouter = require('./routes/login');
var tatuadorRouter = require('./routes/tatuador');
var logoutRouter = require('./routes/logout');
var chatRouter = require('./routes/chat');
var perfilRouter = require('./routes/perfil');

// Inicializa o aplicativo Express
var app = express();

require('./auth')(passport);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

function authenticationMiddleware(req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.logado = true;
    res.locals.id = req.session.passport.user.id;
    res.locals.imagem = req.session.passport.user.imagem;
    res.locals.nome = req.session.passport.user.nome;
    res.locals.tipo = req.session.passport.user.tipo;
    return next();
  }

  if (req.path === "/login") return next();
  res.redirect("/login?erro=1");
}

// Rotas
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cadastro', cadastroRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/tatuador', authenticationMiddleware, tatuadorRouter);
app.use('/chat', authenticationMiddleware, chatRouter); 
app.use('/perfil', authenticationMiddleware, perfilRouter);


app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;