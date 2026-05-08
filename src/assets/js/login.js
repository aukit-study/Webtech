document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault(); // กันหน้าเว็บ Refresh

    const email = document.getElementById('email').value; // ดึงค่าจากช่อง email
    const password = document.getElementById('password').value; // ดึงค่าจากช่อง password
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    // ซ่อนข้อความทั้งสองก่อน
    successMessage.classList.add('d-none');
    errorMessage.classList.add('d-none');



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
            // แสดง Success Alert
            successMessage.textContent = result.message || "ยินดีต้อนรับกลับมา!";
            successMessage.classList.remove('d-none');

            // Redirect หลังจาก 2 วินาที
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            // แสดง Error Alert
            errorMessage.textContent = result.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
            errorMessage.classList.remove('d-none');
        }
    } catch (error) {
        console.error("เชื่อมต่อ Backend ไม่ได้:", error);
        // แสดง Error Alert
        errorMessage.textContent = error.message || "ไม่สามารถเชื่อมต่อ backend ได้";
        errorMessage.classList.remove('d-none');
    }
});