// config/passport.js
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const axios = require('axios');
const User = require('../models/user'); // Adjust the path if needed

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
  scope: ['user:email']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Try to fetch verified primary email from GitHub API
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${accessToken}`,
        'User-Agent': 'my-api'
      }
    });

    const primaryEmailObj = emailResponse.data.find(email => email.primary && email.verified);
    const email = primaryEmailObj ? primaryEmailObj.email : null;

    if (!email) {
      return done(new Error('GitHub account has no verified primary email'));
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not found
      user = await User.create({
        name: profile.displayName || profile.username,
        email: email,
        role: 'user'
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Passport session handling
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
