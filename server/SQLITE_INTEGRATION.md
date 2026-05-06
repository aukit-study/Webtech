# SQLite Integration Guide

## Overview
This project now uses SQLite for persistent data storage instead of JSON files. The database includes tables for users, products, and orders.

---

## Database Schema

### users table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### products table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT,
  image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### orders table (Your ERD Manifested!)
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  total_price REAL NOT NULL,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

## 5. Integration Complete ✓

### What was replaced:
- **Old**: `fs.writeFile()` in checkoutService.js (JSON files)
- **New**: `db.run()` with SQLite INSERT statements

### Files Created/Modified:
1. **Created**: `server/db.js` - Database connection and initialization
2. **Modified**: `server/services/checkoutService.js` - Uses SQLite queries
3. **Modified**: `server/controllers/checkoutController.js` - Saves individual orders to DB
4. **Modified**: `server/app.js` - Initializes database on startup

---

## 6. Debugging & Testing

### Step 1: Run Your Server
```bash
npm start
```

You should see:
```
✓ Connected to SQLite database at: .../server/data/store.db
✓ Database tables initialized
Server is running on http://localhost:3000
```

### Step 2: Install SQLite Viewer Extension
1. Open VS Code Extensions (Ctrl+Shift+X)
2. Search for: **SQLite Viewer** (by Florian Clanet)
3. Install it

### Step 3: Direct Access Test
1. Click the **SQLite Viewer** icon in the left sidebar
2. Click "Open Database"
3. Navigate to: `server/data/store.db`
4. You'll see your tables with real data!

### Step 4: Place a Test Order
1. Use your app to place an order
2. Return to SQLite Viewer
3. Right-click on `orders` table → "Show Table"
4. **Observation**: Your order appears with:
   - user_id (who placed it)
   - product_id (which product)
   - quantity (how many)
   - total_price (the amount)
   - order_date (timestamp)

---

## SQL INSERT Example

When you checkout, this SQL runs:
```sql
INSERT INTO orders (user_id, product_id, quantity, total_price) 
VALUES (1, 5, 2, 199.98);
```

This saves order data directly to the database instead of a JSON file!

---

## Testing Checklist
- [ ] Server starts without errors
- [ ] Database file created at `server/data/store.db`
- [ ] SQLite Viewer extension installed
- [ ] Can open store.db in SQLite Viewer
- [ ] Place an order through the app
- [ ] See new order in orders table with all fields
- [ ] Verify user_id, product_id, quantity, and total_price are correct

---

## Troubleshooting

### Issue: "Cannot find module 'sqlite3'"
**Solution**: Run `npm install sqlite3`

### Issue: Database file not created
**Solution**: Check that `server/data/` directory exists. Create it if needed.

### Issue: SQLite Viewer shows empty tables
**Solution**: Ensure the server is running and you've placed orders through the app.

---

## Next Steps
- Add authentication to save user tokens in database
- Create API endpoints to retrieve user's orders
- Add product inventory management with SQLite
