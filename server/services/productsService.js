const ProductRepository = require('../repositories/ProductRepository');

/**
 * ProductService - Handles product business logic
 * Uses ProductRepository for data access
 */

/**
 * Get all products, optionally filtered by category
 * Business logic: filter by category if provided
 * @param {string} category - Optional category filter
 * @returns {Promise<Array>} Array of products
 */
async function getProducts(category) {
  try {
    let products;

    if (category) {
      // Business logic: search by category
      products = await ProductRepository.searchByCategory(category);
    } else {
      // Business logic: get all products
      products = await ProductRepository.findAll();
    }

    return products;
  } catch (error) {
    throw new Error(`ProductService - getProducts failed: ${error.message}`);
  }
}

/**
 * Get single product by ID
 * @param {number} id - Product ID
 * @returns {Promise<Object|null>} Product object or null
 */
async function getProductById(id) {
  try {
    const product = await ProductRepository.findById(id);
    return product;
  } catch (error) {
    throw new Error(`ProductService - getProductById failed: ${error.message}`);
  }
}

/**
 * Get multiple products by IDs (for shopping cart)
 * @param {Array<number>} ids - Array of product IDs
 * @returns {Promise<Array>} Array of products
 */
async function getProductsByIds(ids) {
  try {
    const products = await ProductRepository.findByIds(ids);
    return products;
  } catch (error) {
    throw new Error(`ProductService - getProductsByIds failed: ${error.message}`);
  }
}

module.exports = {
  getProducts,
  getProductById,
  getProductsByIds
};
