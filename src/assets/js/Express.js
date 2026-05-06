const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

import { users } from '../../../server/data/users.json'; // นำเข้าข้อมูลผู้ใช้จากไฟล์ users.js

const JWT_SECRET = 'your_super_secret_furniture_key'; // Use an environment variable in production

router.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = users.find(u => u.email === email);
        if (!user) {
            // Security Tip: Use generic messages so hackers don't know which part was wrong
            return res.status(401).json({ message: "Invalid email or password" });
            console.error("Login ล้มเหลว: " + response.statusText);
        }

        // 2. Securely compare password with bcrypt
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
            console.error("Login ล้มเหลว: " + response.statusText);
        }

        // 3. Generate JWT Token
        const token = jwt.sign(
            { userId: user.id }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // 4. Return success
        res.status(200).json({ 
            message: "Login successful...",
            token: token
        });
        console.log("เข้าสู่ระบบสำเร็จ!");

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal server error" });
        console.error("Login ล้มเหลว: " + response.statusText);
    }
});

module.exports = router;