const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Path to products JSON file
const productsFilePath = path.resolve(__dirname, 'data', 'products.json');

// Initialize database
const db = new sqlite3.Database('./data/store.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('✓ Connected to SQLite database');

  // Start migration
  migrateProducts();
});

async function migrateProducts() {
  try {
    // Read products from JSON file
    const productsData = fs.readFileSync(productsFilePath, 'utf8');
    const products = JSON.parse(productsData);

    console.log(`📦 Found ${products.length} products in JSON file`);

    // Check if products table already has data
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (err) {
        console.error('Error checking products table:', err);
        return;
      }

      if (row.count > 0) {
        console.log('⚠️  Products table already has data. Skipping migration.');
        console.log(`   Found ${row.count} products in database.`);
        db.close();
        return;
      }

      // Insert products into database
      let inserted = 0;
      const stmt = db.prepare(`
        INSERT INTO products (name, price, description, image)
        VALUES (?, ?, ?, ?)
      `);

      products.forEach((product, index) => {
        stmt.run([
          product.name,
          product.price,
          product.description,
          product.urlimage || product.image || ''
        ], function(err) {
          if (err) {
            console.error(`Error inserting product ${product.id}:`, err);
          } else {
            inserted++;
            console.log(`✓ Inserted: ${product.name} (ID: ${this.lastID})`);

            // Check if this is the last product
            if (inserted === products.length) {
              console.log(`\n🎉 Migration complete! ${inserted} products added to database.`);
              stmt.finalize();
              db.close();
            }
          }
        });
      });
    });

  } catch (error) {
    console.error('Migration error:', error);
    db.close();
  }
}