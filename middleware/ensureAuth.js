function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}

// Apply to protected routes
app.use('/products', ensureAuthenticated, productRoutes);
app.use('/users', ensureAuthenticated, userRoutes);
