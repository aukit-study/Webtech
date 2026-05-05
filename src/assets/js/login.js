document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault(); // กันหน้าเว็บ Refresh

    const email = document.getElementById('email').value; // ดึงค่าจากช่อง email
    const password = document.getElementById('password').value; // ดึงค่าจากช่อง password

    try {
        // ส่ง "Envelope" ไปยัง Server
        const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
        });

        const result = await response.json().catch(() => ({}));

        if (response.status === 200) {
            localStorage.setItem('userToken', result.token);
            alert(result.message || "ยินดีต้อนรับกลับมา!");
            window.location.href = 'index.html';
        } else {
            alert(result.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }
    } catch (error) {
        console.error("เชื่อมต่อ Backend ไม่ได้:", error);
        alert(error.message || "ไม่สามารถเชื่อมต่อ backend ได้");
    }
});