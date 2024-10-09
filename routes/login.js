const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
  res.render('login', { title: 'Login', message: req.flash('error') });
});

router.post('/', 
  passport.authenticate('local', {
    successRedirect: '/', // Redireciona para a página inicial após o login
    failureRedirect: '/login',
    failureFlash: true
  })
);

module.exports = router;
