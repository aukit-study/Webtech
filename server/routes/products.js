const express = require('express');
const productsController = require('../controllers/productsController');

const router = express.Router();

// GET /api/products
router.get('/products', productsController.getProducts);

module.exports = router;
