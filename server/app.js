const express = require('express');
const cors = require('cors'); // สำหรับอนุญาตให้ Frontend เข้าถึง API
const path = require('path');
const productsRouter = require('./routes/products'); // นำเข้าเส้นทางสินค้า
const authRouter = require('./routes/auth');

const app = express();
const publicPath = path.resolve(__dirname, '..', 'src');

// Middleware
app.use(cors());
app.use(express.json()); // สำหรับอ่านข้อมูล JSON ที่ส่งมาจากฟอร์ม Login[cite: 13]
app.use(express.static(publicPath)); // Serve frontend files from src

// Routes - เชื่อมต่อด่านหน้าไปยังเส้นทางต่างๆ
app.use('/api', authRouter);
app.use('/api', productsRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});