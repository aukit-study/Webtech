const productsService = require('../services/productsService');

async function getProducts(req, res, next) {
  try {
    const { category } = req.query;
    const products = await productsService.getProducts(category);
    return res.json({ data: products });
  } catch (error) {
    console.error('ProductsController.getProducts error:', error);
    return res.status(500).json({ error: 'Unable to retrieve products' });
  }
}

module.exports = {
  getProducts,
};
