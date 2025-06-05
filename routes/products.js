const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const productSchema = require('../validation/productValidation');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

//getting all products
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

//getting one product
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
 *         description: ID of the product
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

//creating one product
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
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
router.post('/', async (req, res) => {
  try {
    // Step 1: Validate input
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Step 2: Create product
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      inStock: req.body.inStock,
      category: req.body.category,
      supplier: req.body.supplier,
      rating: req.body.rating,
    });

    // Step 3: Save product
    const newProduct = await product.save();
    res.status(201).json(newProduct);

  } catch (err) {
    // Handle unexpected errors
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error occurred. Please try again later.' });
  }
});

//updating one product

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
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
router.put('/:id', async (req, res) => {
  try {
    // Step 1: Validate input
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Step 2: Find and update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        inStock: req.body.inStock,
        category: req.body.category,
        supplier: req.body.supplier,
        rating: req.body.rating,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Step 3: Respond with updated product
    res.status(200).json(updatedProduct);

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error occurred. Please try again later.' });
  }
});

//deleting one product
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete('/:id', getProduct, async (req, res) => {
   try {
        await res.product.deleteOne();
        res.json({ message: 'Deleted Product' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function getProduct(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({ message: 'Cannot find user' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.product = product;
    next();
    
}

module.exports = router;