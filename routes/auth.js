const express = require('express');
const passport = require('passport');
const router = express.Router();

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: Initiates GitHub OAuth2 login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to GitHub login
 */
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     summary: GitHub OAuth2 callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Authentication failed
 */
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/login-failure' }),
  (req, res, next) => {
    req.login(req.user, (err) => {
      if (err) return next(err);
      return res.json({
        message: 'Logged in successfully',
        user: {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email
        }
      });
    });
  }
);

// Optional: Handle failed login attempt
router.get('/auth/login-failure', (req, res) => {
  res.status(401).json({ message: 'GitHub authentication failed' });
});

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
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;

