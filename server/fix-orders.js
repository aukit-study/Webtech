const sqlite3 = require('sqlite3').verbose();

// Initialize database
const db = new sqlite3.Database('./data/store.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('✓ Connected to SQLite database');

  // Fix existing orders
  fixExistingOrders();
});

async function fixExistingOrders() {
  console.log('🔧 Fixing existing orders with incorrect product IDs...');

  // Get all orders with string product IDs
  db.all('SELECT * FROM orders WHERE product_id LIKE "prod_%"', (err, orders) => {
    if (err) {
      console.error('Error fetching orders:', err);
      db.close();
      return;
    }

    if (orders.length === 0) {
      console.log('✅ No orders need fixing.');
      db.close();
      return;
    }

    console.log(`📦 Found ${orders.length} orders to fix`);

    let fixed = 0;
    orders.forEach(order => {
      // Extract number from prod_XXX
      const match = order.product_id.match(/^prod_(\d+)$/);
      if (match) {
        const numericId = parseInt(match[1]);

        // Update the order
        db.run(
          'UPDATE orders SET product_id = ? WHERE id = ?',
          [numericId, order.id],
          function(err) {
            if (err) {
              console.error(`Error updating order ${order.id}:`, err);
            } else {
              fixed++;
              console.log(`✓ Fixed order ${order.id}: ${order.product_id} → ${numericId}`);

              // Check if all orders are fixed
              if (fixed === orders.length) {
                console.log(`\n🎉 Fixed ${fixed} orders successfully!`);
                db.close();
              }
            }
          }
        );
      }
    });
  });
}