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
var chatAtivoRouter = require('./routes/chatAtivo');
var perfilRouter = require('./routes/perfil');
var apagarRouter = require('./routes/apagar'); // Importação da rota apagar
var comentariosRouter = require('./routes/comentarios');
var fotoRouter = require('./routes/foto');
const { isAuthenticated } = require('./auth'); // Importação da função isAuthenticated

var app = express();

require('./auth')(passport);

require('./models/Usuario');
require('./models/Chat');
require('./models/comentarios');
require('./models/associations');

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

app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario;
  next();
});

function authenticationMiddleware(req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.logado = true;
    res.locals.id = req.session.passport.user.id;
    res.locals.imagem = req.session.passport.user.imagem;
    res.locals.nome = req.session.passport.user.nome;
    res.locals.tipo = req.session.passport.user.tipo;
    req.session.usuario = req.session.passport.user; // Define a variável de sessão usuario
    return next();
  }

  if (req.path === "/login" || req.path === "/tatuadores") return next(); // Permite acesso à rota /tatuadores sem autenticação
  res.redirect("/login?erro=1");
}

// Rotas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cadastro', cadastroRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/tatuadores', tatuadorRouter); // Adiciona a rota /tatuadores sem autenticação
app.use('/tatuador', authenticationMiddleware, tatuadorRouter);
app.use('/chat', authenticationMiddleware, chatRouter);
app.use('/chatAtivo', authenticationMiddleware, chatAtivoRouter);
app.use('/apagar', authenticationMiddleware, apagarRouter); // Configuração da rota apagar
app.use('/perfil', authenticationMiddleware, perfilRouter);
app.use('/comentarios', authenticationMiddleware, comentariosRouter);
app.use('/foto', authenticationMiddleware, fotoRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});

module.exports = app;