const { runQuery, getAll, getOne } = require('../db');

/**
 * OrderRepository - Handles all database operations for Orders
 * Pure data access layer - no business logic here
 */
class OrderRepository {
  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Created order with ID
   */
  async create(orderData) {
    try {
      const { user_id, product_id, quantity, total_price, customer_name, customer_address, customer_phone } = orderData;

      // Validate required fields at repository level for data integrity
      if (!user_id || !product_id || !quantity || !total_price) {
        throw new Error('Missing required fields: user_id, product_id, quantity, total_price');
      }

      const result = await runQuery(
        `INSERT INTO orders (user_id, product_id, quantity, total_price, customer_name, customer_address, customer_phone)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, product_id, quantity, total_price, customer_name, customer_address, customer_phone]
      );

      return {
        id: result.id,
        user_id,
        product_id,
        quantity,
        total_price,
        customer_name,
        customer_address,
        customer_phone,
        order_date: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Repository error - create: ${error.message}`);
    }
  }

  /**
   * Get all orders
   * @returns {Promise<Array>} Array of all orders
   */
  async findAll() {
    try {
      const orders = await getAll('SELECT * FROM orders ORDER BY order_date DESC');
      return orders;
    } catch (error) {
      throw new Error(`Repository error - findAll: ${error.message}`);
    }
  }

  /**
   * Get orders by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of user's orders
   */
  async findByUserId(userId) {
    try {
      const orders = await getAll(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC',
        [userId]
      );
      return orders;
    } catch (error) {
      throw new Error(`Repository error - findByUserId: ${error.message}`);
    }
  }

  /**
   * Get order by ID
   * @param {number} id - Order ID
   * @returns {Promise<Object|null>} Order object or null
   */
  async findById(id) {
    try {
      const order = await getOne('SELECT * FROM orders WHERE id = ?', [id]);
      return order;
    } catch (error) {
      throw new Error(`Repository error - findById: ${error.message}`);
    }
  }
}

module.exports = new OrderRepository();
