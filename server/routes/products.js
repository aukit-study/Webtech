const express = require('express');
const productsController = require('../controllers/productsController');

const router = express.Router();

// GET /api/products
// Optional query parameter: category
// Example: /api/products?category=office
router.get('/products', productsController.getProducts);

module.exports = router;
