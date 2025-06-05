require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product & User API',
      version: '1.0.0',
      description: 'API documentation for managing products and users',
    },
    servers: [
      { url: 'https://my-api-6pk4.onrender.com' }, // Change to Render URL after deployment
    ],
  },
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connected to MongoDB")).catch(err => console.error(err));


app.get('/', (req, res) => {
  res.send('Welcome to the Product & User API. Visit /api-docs for documentation.');
});

app.use(express.json());

const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

const productRoutes = require('./routes/products');
app.use('/products', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
