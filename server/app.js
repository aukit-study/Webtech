require('dotenv').config();
const express = require('express');
const cors = require('cors'); // สำหรับอนุญาตให้ Frontend เข้าถึง API
const path = require('path');
const db = require('./db'); // Initialize SQLite database

// Update database schema for shipping info
db.db.serialize(() => {
  // Add shipping columns to orders table
  db.db.run(`
    ALTER TABLE orders ADD COLUMN customer_name TEXT;
  `, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.log('Note: customer_name column may already exist');
    }
  });

  db.db.run(`
    ALTER TABLE orders ADD COLUMN customer_address TEXT;
  `, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.log('Note: customer_address column may already exist');
    }
  });

  db.db.run(`
    ALTER TABLE orders ADD COLUMN customer_phone TEXT;
  `, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.log('Note: customer_phone column may already exist');
    }
  });
});
const productsRouter = require('./routes/products'); // นำเข้าเส้นทางสินค้า
const authRouter = require('./routes/auth');
const checkoutRouter = require('./routes/checkout');

const app = express();
const publicPath = path.resolve(__dirname, '..', 'src');

// Middleware
app.use(cors());
app.use(express.json()); // สำหรับอ่านข้อมูล JSON ที่ส่งมาจากฟอร์ม Login[cite: 13]
app.use(express.static(publicPath)); // Serve frontend files from src

// Routes - เชื่อมต่อด่านหน้าไปยังเส้นทางต่างๆ
app.use('/api', authRouter);
app.use('/api', productsRouter);
app.use('/api', checkoutRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});