const fs = require('fs/promises');
const path = require('path');

const ordersFilePath = path.resolve(__dirname, '..', 'data', 'orders.json');

async function saveOrder(orderData) {
  try {
    // Read existing orders
    let orders = [];
    try {
      const fileContent = await fs.readFile(ordersFilePath, 'utf8');
      orders = JSON.parse(fileContent);
    } catch (err) {
      // File doesn't exist yet, start with empty array
      orders = [];
    }

    // Create new order with ID
    const newOrder = {
      id: (orders.length + 1).toString(),
      ...orderData
    };

    orders.push(newOrder);

    // Save orders to file
    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2));

    return newOrder;
  } catch (error) {
    throw new Error(`Failed to save order: ${error.message}`);
  }
}

module.exports = {
  saveOrder
};
