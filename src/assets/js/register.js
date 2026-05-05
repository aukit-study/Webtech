document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form refresh

    const firstName = document.getElementById('firstName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, firstName })
        });

        const result = await response.json().catch(() => ({}));

        if (response.status === 201) {
            localStorage.setItem('userToken', result.token);
            alert(result.message || 'Registration successful!');
            window.location.href = 'index.html';
        } else {
            alert(result.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Unable to connect to server');
    }
});