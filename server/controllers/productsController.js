const productsService = require('../services/productsService');
const fs = require('fs');
const path = require('path');

/**
 * ProductsController - Handles HTTP requests/responses for products
 * Delegates business logic to ProductService
 */

/**
 * Get products handler
 * HTTP: GET /api/products?category=office
 * Controllers responsibility:
 *   - Extract request/query parameters
 *   - Call service for business logic
 *   - Format HTTP response
 *   - Handle data enrichment (JSON mapping)
 */
async function getProducts(req, res) {
  try {
    const { category } = req.query;

    // Call service for business logic
    const products = await productsService.getProducts(category);
    
    // Controller responsibility: data enrichment (frontend compatibility)
    let productsJson = [];
    try {
      const jsonPath = path.resolve(__dirname, '..', 'data', 'products.json');
      productsJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } catch (e) {
      console.error('Failed to read products.json', e);
    }
    
    // Enrich products with additional metadata
    const enrichedProducts = products.map(p => {
      const original = productsJson.find(oj => oj.name === p.name);
      return {
        ...p,
        category: original ? original.category : 'Furniture',
        urlimage: p.image
      };
    });

    return res.json({ data: enrichedProducts });
  } catch (error) {
    console.error('ProductsController.getProducts error:', error);
    return res.status(500).json({ error: 'Unable to retrieve products' });
  }
}

module.exports = {
  getProducts,
};
