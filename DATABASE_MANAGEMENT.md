# วิธีจัดการฐานข้อมูล SQLite (ไม่ต้องใช้ phpMyAdmin)

## 🎯 วิธีที่ 1: SQLite Viewer Extension ใน VS Code (แนะนำ)

### ขั้นตอน:
1. **ติดตั้ง Extension**: ค้นหา "SQLite Viewer" ใน VS Code Extensions
2. **เปิดฐานข้อมูล**: คลิกไอคอน SQLite Viewer → "Open Database"
3. **เลือกไฟล์**: `server/data/store.db`
4. **จัดการข้อมูล**: 
   - ดูตารางทั้งหมด
   - คลิกขวาที่ตาราง → "Show Table"
   - แก้ไขข้อมูลได้โดยตรง

## 🖥️ วิธีที่ 2: DB Browser for SQLite (GUI ฟรี)

### ดาวน์โหลด:
- เข้าเว็บ: https://sqlitebrowser.org/
- ดาวน์โหลดและติดตั้ง

### ใช้งาน:
1. เปิดโปรแกรม
2. File → Open Database → เลือก `server/data/store.db`
3. ดู/แก้ไขข้อมูลในแท็บต่างๆ

## 💻 วิธีที่ 3: Command Line (ถ้าต้องการ)

### ติดตั้ง SQLite CLI:
```bash
# Windows (Chocolatey)
choco install sqlite

# หรือดาวน์โหลดจาก: https://www.sqlite.org/download.html
```

### ใช้งาน:
```bash
cd server/data
sqlite3 store.db

# ใน SQLite shell:
.tables                    # ดูตารางทั้งหมด
.schema orders            # ดูโครงสร้างตาราง
SELECT * FROM orders;     # ดูข้อมูลในตาราง
.quit                     # ออก
```

## 🔧 วิธีที่ 4: ใช้ Node.js Script (ที่เราใช้ตรวจสอบ)

### รันคำสั่งตรวจสอบฐานข้อมูล:
```bash
cd server
node check-db.js
```

### หรือเขียน Script เอง:
```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/store.db');

// ตัวอย่าง: แสดงคำสั่งซื้อทั้งหมด
db.all('SELECT * FROM orders', (err, rows) => {
  if (err) console.error(err);
  else console.log('Orders:', rows);
  db.close();
});
```

## 📊 วิธีที่ 5: ดูข้อมูลผ่าน API

### สร้าง Endpoint ใหม่ใน `server/routes/orders.js`:
```javascript
const express = require('express');
const { getAll } = require('../db');
const router = express.Router();

// ดูคำสั่งซื้อทั้งหมด (สำหรับ Admin)
router.get('/', async (req, res) => {
  try {
    const orders = await getAll('SELECT * FROM orders ORDER BY order_date DESC');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### เพิ่มใน `app.js`:
```javascript
app.use('/api/orders', require('./routes/orders'));
```

### เข้าถึงได้ที่: `http://localhost:3000/api/orders`

## 🎯 **แนะนำให้ใช้: SQLite Viewer Extension**

เพราะ:
- ✅ ง่ายที่สุด - ไม่ต้องติดตั้งอะไรเพิ่ม
- ✅ ทำงานใน VS Code ที่คุณใช้อยู่แล้ว
- ✅ ดูข้อมูลแบบ Real-time
- ✅ แก้ไขข้อมูลได้โดยตรง
- ✅ ไม่ต้องใช้ phpMyAdmin เลย!

## 📝 วิธีทดสอบ:

1. **เปิด VS Code**
2. **ติดตั้ง SQLite Viewer** (ถ้ายังไม่มี)
3. **เปิดฐานข้อมูล**: `server/data/store.db`
4. **ลองสั่งซื้อสินค้า** ผ่านเว็บ
5. **กลับมาดูใน SQLite Viewer** - จะเห็นข้อมูลใหม่ปรากฏขึ้นมา!

---

**สรุป**: SQLite ไม่ต้องใช้ phpMyAdmin เพราะมีเครื่องมือที่ดีกว่ามากมายให้เลือกใช้!