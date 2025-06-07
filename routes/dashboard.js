const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/authMiddleware');

// Protected route - only accessible to authenticated users
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.send(`Welcome, ${req.user.username || req.user.displayName || 'User'}!`);
});

module.exports = router;
