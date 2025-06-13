require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const ensureAuthenticated = require('./middleware/authMiddleware');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

// Middleware to parse JSON
app.use(express.json());

// Session management (before passport)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60 // 14 days
  })
}));

// Passport configuration and middleware
app.set('trust proxy', 1)
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Swagger setup with OAuth2
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product & User API',
      version: '1.0.0',
      description: 'API documentation for managing products and users',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'https://my-api-6pk4.onrender.com',
      }
    ],
    components: {
      securitySchemes: {
        oauth2: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: 'https://github.com/login/oauth/authorize',
              tokenUrl: 'https://github.com/login/oauth/access_token',
              scopes: {
                'user:email': 'Access your email address'
              }
            }
          }
        }
      }
    },
    security: [{ oauth2: ['user:email'] }]
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Public Endpoints
app.get('/', (req, res) => {
  res.send('Welcome to the Product & User API. Visit /api-docs for documentation.');
});
app.use('/auth', authRoutes);
app.use('/', dashboardRoutes);

// Protected Endpoints
app.use('/products', ensureAuthenticated, productRoutes);
app.use('/users', ensureAuthenticated, userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
