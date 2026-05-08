const { getAll, getOne } = require('../db');

/**
 * ProductRepository - Handles all database operations for Products
 * Pure data access layer - no business logic here
 */
class ProductRepository {
  /**
   * Get all products
   * @returns {Promise<Array>} Array of all products
   */
  async findAll() {
    try {
      const products = await getAll('SELECT * FROM products ORDER BY id');
      return products;
    } catch (error) {
      throw new Error(`Repository error - findAll: ${error.message}`);
    }
  }

  /**
   * Find product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object|null>} Product object or null
   */
  async findById(id) {
    try {
      const product = await getOne('SELECT * FROM products WHERE id = ?', [id]);
      return product;
    } catch (error) {
      throw new Error(`Repository error - findById: ${error.message}`);
    }
  }

  /**
   * Find products by multiple IDs (for cart)
   * @param {Array<number>} ids - Array of product IDs
   * @returns {Promise<Array>} Array of products
   */
  async findByIds(ids) {
    try {
      if (!ids || ids.length === 0) return [];

      const placeholders = ids.map(() => '?').join(',');
      const query = `SELECT * FROM products WHERE id IN (${placeholders})`;
      const products = await getAll(query, ids);
      return products;
    } catch (error) {
      throw new Error(`Repository error - findByIds: ${error.message}`);
    }
  }

  /**
   * Search products by category or name
   * @param {string} searchTerm - Search term (category or name)
   * @returns {Promise<Array>} Array of matching products
   */
  async searchByCategory(searchTerm) {
    try {
      const query = 'SELECT * FROM products WHERE LOWER(description) LIKE ? OR LOWER(name) LIKE ? ORDER BY id';
      const term = `%${searchTerm.toLowerCase()}%`;
      const products = await getAll(query, [term, term]);
      return products;
    } catch (error) {
      throw new Error(`Repository error - searchByCategory: ${error.message}`);
    }
  }
}

module.exports = new ProductRepository();
