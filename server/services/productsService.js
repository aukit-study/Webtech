const { getAll, getOne } = require('../db');

// Get all products or filter by category
async function getProducts(category) {
  try {
    let query = 'SELECT * FROM products ORDER BY id';
    let params = [];

    if (category) {
      query = 'SELECT * FROM products WHERE LOWER(description) LIKE ? OR LOWER(name) LIKE ? ORDER BY id';
      const searchTerm = `%${category.toLowerCase()}%`;
      params = [searchTerm, searchTerm];
    }

    const products = await getAll(query, params);
    return products;
  } catch (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
}

// Get product by ID
async function getProductById(id) {
  try {
    const product = await getOne('SELECT * FROM products WHERE id = ?', [id]);
    return product;
  } catch (error) {
    throw new Error(`Failed to fetch product: ${error.message}`);
  }
}

// Get products by IDs (for cart)
async function getProductsByIds(ids) {
  try {
    if (!ids || ids.length === 0) return [];

    const placeholders = ids.map(() => '?').join(',');
    const query = `SELECT * FROM products WHERE id IN (${placeholders})`;
    const products = await getAll(query, ids);
    return products;
  } catch (error) {
    throw new Error(`Failed to fetch products by IDs: ${error.message}`);
  }
}

module.exports = {
  getProducts,
  getProductById,
  getProductsByIds
};
