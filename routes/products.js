 const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const productSchema = require('../validation/productValidation');
const ensureAuthenticated = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get('/:id', getProduct, (req, res) => {
  res.json(res.product);
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - oauth2: [profile, email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - inStock
 *               - category
 *               - supplier
 *               - rating
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: string
 *               inStock:
 *                 type: boolean
 *               category:
 *                 type: string
 *               supplier:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Bad request
 */
/**
 * @swagger
 * security:
 *   - oauth2: ['user:email']
 */

router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const product = new Product(req.body);
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error occurred. Please try again later.' });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - oauth2: [profile, email]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: string
 *               inStock:
 *                 type: boolean
 *               category:
 *                 type: string
 *               supplier:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated
 */
/**
 * @swagger
 * security:
 *   - oauth2: ['user:email']
 */

router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error occurred. Please try again later.' });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - oauth2: [profile, email]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete('/:id', ensureAuthenticated, getProduct, async (req, res) => {
  try {
    await res.product.deleteOne();
    res.json({ message: 'Deleted Product' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper middleware to get a product by ID
async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Cannot find product' });

    res.product = product;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;