const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/store.db');

console.log('=== SQLite Database Manager ===\n');

// Show all tables
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('📋 Tables in database:');
    rows.forEach(row => console.log(`  - ${row.name}`));
    console.log('');

    // Show orders table content
    if (rows.some(r => r.name === 'orders')) {
      db.all('SELECT * FROM orders ORDER BY order_date DESC LIMIT 5', (err, orders) => {
        if (err) {
          console.error('Error reading orders:', err);
        } else {
          console.log('📦 Recent Orders:');
          if (orders.length === 0) {
            console.log('  (No orders yet)');
          } else {
            orders.forEach(order => {
              console.log(`  ID: ${order.id}, User: ${order.user_id}, Product: ${order.product_id}, Qty: ${order.quantity}, Total: $${order.total_price}, Date: ${order.order_date}`);
            });
          }
        }

        // Show users table content
        db.all('SELECT id, email, created_at FROM users ORDER BY created_at DESC LIMIT 5', (err, users) => {
          if (err) {
            console.error('Error reading users:', err);
          } else {
            console.log('\n👥 Recent Users:');
            if (users.length === 0) {
              console.log('  (No users yet)');
            } else {
              users.forEach(user => {
                console.log(`  ID: ${user.id}, Email: ${user.email}, Created: ${user.created_at}`);
              });
            }
          }

          db.close();
          console.log('\n✅ Database check complete!');
        });
      });
    } else {
      db.close();
      console.log('❌ Orders table not found - database may not be initialized yet');
    }
  }
});