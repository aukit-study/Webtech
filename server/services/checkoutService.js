const { runQuery, getAll, getOne } = require('../db');

// SQL: INSERT statement for saving orders
// INSERT INTO orders (user_id, product_id, quantity, total_price) 
// VALUES (?, ?, ?, ?);

async function saveOrder(orderData) {
  try {
    const { user_id, product_id, quantity, total_price, customer_name, customer_address, customer_phone } = orderData;

    // Validate input
    if (!user_id || !product_id || !quantity || !total_price) {
      throw new Error('Missing required fields: user_id, product_id, quantity, total_price');
    }

    // Insert order into database
    const result = await runQuery(
      `INSERT INTO orders (user_id, product_id, quantity, total_price, customer_name, customer_address, customer_phone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, product_id, quantity, total_price, customer_name, customer_address, customer_phone]
    );

    // Return the saved order with ID
    const newOrder = {
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

    return newOrder;
  } catch (error) {
    throw new Error(`Failed to save order: ${error.message}`);
  }
}

// Get all orders
async function getAllOrders() {
  try {
    const orders = await getAll('SELECT * FROM orders ORDER BY order_date DESC');
    return orders;
  } catch (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }
}

// Get orders by user_id
async function getOrdersByUserId(user_id) {
  try {
    const orders = await getAll(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC`,
      [user_id]
    );
    return orders;
  } catch (error) {
    throw new Error(`Failed to fetch user orders: ${error.message}`);
  }
}

module.exports = {
  saveOrder,
  getAllOrders,
  getOrdersByUserId
};
