const express = require('express');
const passport = require('passport');
const router = express.Router();

// Initiate GitHub authentication
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Handle GitHub callback and redirect
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/dashboard');
  }
);

// Logout route
/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logs the user out and ends session
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/'); // or send a response if it's an API
  });
});

module.exports = router;

