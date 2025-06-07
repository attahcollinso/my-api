const express = require('express');
const router = express.Router();
const passport = require('passport');

// Initiate GitHub authentication
router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// Handle callback and redirect
router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;

