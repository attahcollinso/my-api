require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Passport configuration
require('./config/passport');

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
        url: process.env.BASE_URL || 'http://localhost:3000',
      }
    ],
    components: {
      securitySchemes: {
        oauth2: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
              tokenUrl: 'https://oauth2.googleapis.com/token',
              scopes: {
                profile: 'Access your profile information',
                email: 'Access your email address',
              }
            }
          }
        }
      }
    },
    security: [
      {
        oauth2: ['profile', 'email']
      }
    ]
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

// Middleware
app.use(express.json());

// Session and Passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET, // Store this in your .env file
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Product & User API. Visit /api-docs for documentation.');
});

const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

const productRoutes = require('./routes/products');
app.use('/products', productRoutes);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const dashboardRoutes = require('./routes/dashboard');
app.use('/', dashboardRoutes); // Or app.use('/dashboard', dashboardRoutes);


// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
